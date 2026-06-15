import type { NextFunction, Request, Response } from 'express'

const FIREBASE_PROJECT_ID = 'appfilazero'
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBt16NKxV0elaCebh1CN8tTs-rkxqb1AQc'
const FIREBASE_ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`
const GOOGLE_ACCOUNT_INFO_URL = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${FIREBASE_API_KEY}`

type FirebaseTokenPayload = {
  aud?: string
  exp?: number
  iat?: number
  iss?: string
  sub?: string
  user_id?: string
  [key: string]: unknown
}

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }

  return path
}

function isPublicRoute(req: Request): boolean {
  const path = normalizePath(req.path)

  if (req.method === 'GET' && path === '/health') {
    return true
  }

  if (req.method === 'POST' && path === '/tenants') {
    return true
  }

  if (req.method === 'POST' && path === '/webhooks/mercadopago') {
    return true
  }

  if (path === '/cron' || path.startsWith('/cron/')) {
    return true
  }

  return false
}

function extractBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) {
    return null
  }

  const [scheme, token] = authorizationHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token.trim()
}

function decodeJwtPayload(token: string): FirebaseTokenPayload {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('INVALID_TOKEN_FORMAT')
  }

  const payload = Buffer.from(parts[1]!, 'base64url').toString('utf-8')
  return JSON.parse(payload) as FirebaseTokenPayload
}

function validateJwtPayload(payload: FirebaseTokenPayload): string {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  const userId = payload.user_id || payload.sub

  if (!userId || typeof userId !== 'string') {
    throw new Error('INVALID_TOKEN_SUBJECT')
  }

  if (!payload.exp || typeof payload.exp !== 'number' || payload.exp <= nowInSeconds) {
    throw new Error('TOKEN_EXPIRED')
  }

  if (payload.aud !== FIREBASE_PROJECT_ID) {
    throw new Error('INVALID_TOKEN_AUDIENCE')
  }

  if (payload.iss !== FIREBASE_ISSUER) {
    throw new Error('INVALID_TOKEN_ISSUER')
  }

  return userId
}

async function verifyTokenWithGoogle(idToken: string, expectedUserId: string): Promise<string> {
  const response = await fetch(GOOGLE_ACCOUNT_INFO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })

  const payload = await response.json().catch(() => null) as
    | { users?: Array<{ localId?: string }> }
    | { error?: { message?: string } }
    | null

  const users = payload && 'users' in payload ? payload.users : undefined
  const user = users?.[0]

  if (!response.ok || !user?.localId) {
    throw new Error('INVALID_TOKEN_REMOTE_VERIFICATION')
  }

  if (user.localId !== expectedUserId) {
    throw new Error('INVALID_TOKEN_USER_MISMATCH')
  }

  return user.localId
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (isPublicRoute(req)) {
    return next()
  }

  try {
    const token = extractBearerToken(req.header('authorization'))

    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }

    const decodedPayload = decodeJwtPayload(token)
    const userId = validateJwtPayload(decodedPayload)
    const verifiedUserId = await verifyTokenWithGoogle(token, userId)

    req.user = {
      userId: verifiedUserId,
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
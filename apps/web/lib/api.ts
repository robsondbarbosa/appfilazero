'use client'

import { getFirebaseClient } from '@/lib/firebase'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://appfilazero-api.vercel.app')
const TENANT_ID_STORAGE_KEY = 'filazero-tenant-id'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getStoredTenantId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TENANT_ID_STORAGE_KEY)
}

export function setStoredTenantId(tenantId: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(TENANT_ID_STORAGE_KEY, tenantId)
}

export function clearStoredTenantId() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(TENANT_ID_STORAGE_KEY)
}

export function resolveTenantId(userTenantId?: string | null): string | null {
  return userTenantId || getStoredTenantId()
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const { auth } = await getFirebaseClient()
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null
  const headers = new Headers(init?.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const responseText = await response.text()
  const payload = responseText ? JSON.parse(responseText) : null

  if (!response.ok) {
    throw new ApiError(
      payload?.error || payload?.message || 'Não foi possível concluir a operação.',
      response.status
    )
  }

  return payload as T
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function toIsoDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString()
}
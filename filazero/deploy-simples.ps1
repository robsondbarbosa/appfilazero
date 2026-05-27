# Deploy FilaZero - Script Simplificado
Write-Host "Deploy FilaZero" -ForegroundColor Green

$baseDir = "C:\Users\RTI\.verdent\verdent-projects\filazero"
$webSource = "$baseDir\apps\web"
$webDeploy = "C:\Users\RTI\.verdent\verdent-projects\appfilazero-deploy"

# Limpar e criar pasta
if (Test-Path $webDeploy) { Remove-Item -Recurse -Force $webDeploy }
New-Item -ItemType Directory -Path $webDeploy -Force

# Copiar arquivos
Copy-Item -Path "$webSource\*" -Destination $webDeploy -Recurse -Force

# Remover capacitor
Remove-Item "$webDeploy\capacitor.config.ts" -ErrorAction SilentlyContinue

# Corrigir package.json
$pkg = Get-Content "$webDeploy\package.json" -Raw
$pkg = $pkg -replace '"@filazero/types": "\*"', ''
$pkg = $pkg -replace '"@filazero/firebase": "\*"', ''
$pkg = $pkg -replace ',\s*,', ','
Set-Content "$webDeploy\package.json" $pkg

# Corrigir imports
Get-ChildItem "$webDeploy" -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '@filazero/firebase/client', '@/lib/firebase/client'
    $content = $content -replace '@filazero/firebase', '@/lib/firebase'
    $content = $content -replace '@filazero/types', '@/lib/types'
    Set-Content $_.FullName $content
}

# Criar firebase
New-Item -ItemType Directory -Path "$webDeploy\lib\firebase" -Force

$clientTs = @"
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456:web:dummy'
}

let app, auth, db
if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(config) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }
export const googleProvider = typeof window !== 'undefined' ? new GoogleAuthProvider() : null
"@

Set-Content "$webDeploy\lib\firebase\client.ts" $clientTs
Set-Content "$webDeploy\lib\firebase\index.ts" "export { app, auth, db, googleProvider } from './client'"

$typesTs = @"
export enum UserRole {
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
  CLIENT = 'client'
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
"@

Set-Content "$webDeploy\lib\types.ts" $typesTs

# Corrigir next.config.js
$nextConfig = @"
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
module.exports = nextConfig
"@

Set-Content "$webDeploy\next.config.js" $nextConfig

# Deploy
Set-Location $webDeploy
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install --legacy-peer-deps 2>$null

Write-Host "Fazendo deploy..." -ForegroundColor Yellow
Write-Host "Responda as perguntas do Vercel:" -ForegroundColor Cyan
npx vercel --prod

Write-Host "Deploy concluido!" -ForegroundColor Green
Set-Location $baseDir

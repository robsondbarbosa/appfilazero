# Deploy Completo - AppFilaZero

Write-Host "🚀 DEPLOY APPFILAZERO" -ForegroundColor Green
Write-Host ""

# Verificar Node
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Vercel
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Deploy Backend
Write-Host "🔧 Deploy Backend..." -ForegroundColor Cyan
$apiDir = Join-Path $baseDir "apps\api"
if (Test-Path $apiDir) {
    Set-Location $apiDir
    vercel --prod
}

# Deploy Frontend  
Write-Host "📱 Deploy Frontend..." -ForegroundColor Cyan
$webDir = Join-Path $baseDir "apps\web"
if (Test-Path $webDir) {
    Set-Location $webDir
    vercel --prod
}

Set-Location $baseDir
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "Frontend: https://appfilazero.vercel.app" -ForegroundColor Cyan
Write-Host "Backend: https://appfilazero-api.vercel.app" -ForegroundColor Cyan

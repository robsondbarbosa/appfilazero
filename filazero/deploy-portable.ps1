# Deploy na Vercel - Script Portátil
# Uso: Execute da pasta do projeto

param(
    [string]$ProjectPath = $PSScriptRoot
)

Write-Host "🚀 Deploy FilaZero na Vercel" -ForegroundColor Green

# Validar diretório
if (-not (Test-Path $ProjectPath)) {
    Write-Host "❌ Diretório não encontrado: $ProjectPath" -ForegroundColor Red
    exit 1
}

# Navegar para diretório do projeto
Set-Location $ProjectPath
Write-Host "📁 Diretório: $ProjectPath" -ForegroundColor Gray

# Verificar Node.js
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js não encontrado." -ForegroundColor Red
    Write-Host "💡 Instale em: https://nodejs.org" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Node.js encontrado: $(node --version)" -ForegroundColor Green

# Verificar/Instalar Vercel CLI
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    try {
        npm install -g vercel
    } catch {
        Write-Host "❌ Erro ao instalar Vercel CLI" -ForegroundColor Red
        Write-Host "💡 Tente manualmente: npm install -g vercel" -ForegroundColor Cyan
        exit 1
    }
}

# Navegar para pasta do frontend
$webPath = Join-Path $ProjectPath "apps\web"
if (-not (Test-Path $webPath)) {
    Write-Host "❌ Pasta apps/web não encontrada em: $ProjectPath" -ForegroundColor Red
    exit 1
}

Set-Location $webPath
Write-Host "📁 Frontend: $webPath" -ForegroundColor Gray

# Verificar package.json
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "🔐 Login na Vercel..." -ForegroundColor Yellow
Write-Host "💡 Um navegador vai abir. Clique em 'Continue'" -ForegroundColor Cyan

# Login (abre navegador)
vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no login" -ForegroundColor Red
    exit 1
}

Write-Host "🌐 Iniciando deploy..." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Responda às perguntas:" -ForegroundColor Cyan
Write-Host "   Set up and deploy? [Y/n] → Y" -ForegroundColor White
Write-Host "   Which scope? → Selecione sua conta" -ForegroundColor White
Write-Host "   Link to existing project? [y/N] → N" -ForegroundColor White
Write-Host "   Project name? → filazero" -ForegroundColor White
Write-Host ""

# Deploy
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Falha no deploy" -ForegroundColor Red
}

# Voltar para diretório original
Set-Location $ProjectPath

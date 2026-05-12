# Deploy Automático - FilaZero
# Execute no PowerShell

Write-Host "🚀 Iniciando deploy na Vercel..." -ForegroundColor Green

# Verificar Node.js
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js não encontrado. Instale em https://nodejs.org" -ForegroundColor Red
    exit
}

# Instalar Vercel CLI se não existir
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navegar para pasta do frontend
$projectPath = "C:\Users\RTI\.verdent\verdent-projects\filazero\apps\web"
Set-Location $projectPath

Write-Host "🔐 Fazendo login na Vercel..." -ForegroundColor Yellow
Write-Host "💡 Um navegador vai abrir. Clique em 'Continue'" -ForegroundColor Cyan
vercel login

Write-Host "🌐 Iniciando deploy..." -ForegroundColor Yellow
Write-Host "💡 Responda:" -ForegroundColor Cyan
Write-Host "   Set up and deploy? [Y/n] → Y" -ForegroundColor Cyan
Write-Host "   Which scope? → Selecione sua conta" -ForegroundColor Cyan
Write-Host "   Link to existing project? [y/N] → N" -ForegroundColor Cyan
Write-Host "   Project name? → filazero" -ForegroundColor Cyan
Write-Host "   Directory? → ./ (padrão)" -ForegroundColor Cyan

vercel --prod

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 O link do seu site aparecerá acima" -ForegroundColor Cyan

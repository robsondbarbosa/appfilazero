# Deploy FilaZero via Vercel CLI
# Execute no PowerShell

Write-Host "🚀 Deploy FilaZero na Vercel" -ForegroundColor Green

# Verificar se Node.js está instalado
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js não encontrado. Instale em https://nodejs.org" -ForegroundColor Red
    exit
}

# Verificar/Instalar Vercel CLI
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navegar para o projeto
$projectPath = "C:\Users\RTI\.verdent\verdent-projects\filazero\apps\web"
Set-Location $projectPath

Write-Host "🔐 Faça login na Vercel (abra o navegador e confirme)..." -ForegroundColor Yellow
vercel login

Write-Host "🌐 Iniciando deploy..." -ForegroundColor Yellow
Write-Host "💡 Responda as perguntas:" -ForegroundColor Cyan
Write-Host "   - Set up and deploy? [Y/n] → Y" -ForegroundColor Cyan
Write-Host "   - Which scope? → Selecione sua conta" -ForegroundColor Cyan
Write-Host "   - Link to existing project? [y/N] → N" -ForegroundColor Cyan
Write-Host "   - What's your project name? [filazero-web] → filazero" -ForegroundColor Cyan
Write-Host "   - In which directory is your code located? [./] → ./" -ForegroundColor Cyan

vercel --prod

Write-Host "✅ Deploy concluído!" -ForegroundColor Green

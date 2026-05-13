# Script de Deploy - FilaZero
# Execute no PowerShell como Administrador

Write-Host "🚀 Iniciando deploy do FilaZero..." -ForegroundColor Green

# Verificar se gh CLI está instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghInstalled) {
    Write-Host "⚠️ GitHub CLI não encontrado. Instalando..." -ForegroundColor Yellow
    
    # Instalar GitHub CLI
    winget install --id GitHub.cli
    
    Write-Host "✅ GitHub CLI instalado. Reinicie o PowerShell e execute novamente." -ForegroundColor Green
    exit
}

# Verificar login no GitHub
$ghAuth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Faça login no GitHub..." -ForegroundColor Yellow
    gh auth login
}

# Navegar para o diretório do projeto
$projectPath = "C:\Users\RTI\.verdent\verdent-projects\filazero"
Set-Location $projectPath

# Verificar se o repositório já existe
Write-Host "📁 Verificando repositório..." -ForegroundColor Yellow
$repoExists = gh repo view robsondbarbosa/filazero 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Criando repositório no GitHub..." -ForegroundColor Yellow
    
    # Criar repositório
    gh repo create filazero --public --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repositório criado e código enviado!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar repositório" -ForegroundColor Red
        exit
    }
} else {
    Write-Host "📤 Enviando código para o repositório existente..." -ForegroundColor Yellow
    git push -u origin main
}

# Verificar se Vercel CLI está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "⚠️ Vercel CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy na Vercel
Write-Host "🌐 Iniciando deploy na Vercel..." -ForegroundColor Yellow
Write-Host "💡 Quando solicitado, confirme com 'Y'" -ForegroundColor Cyan

Set-Location "$projectPath\apps\web"
vercel --prod

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 URL: https://filazero.vercel.app (ou verifique na saída acima)" -ForegroundColor Cyan

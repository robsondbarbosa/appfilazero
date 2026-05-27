# Quick Fix - Deploy sem Workspaces
$source = "C:\Users\RTI\.verdent\verdent-projects\filazero\apps\web"
$dest = "C:\Users\RTI\.verdent\verdent-projects\appfilazero-web"

Write-Host "🚀 Preparando deploy..." -ForegroundColor Green

# Remover pasta antiga se existir
if (Test-Path $dest) {
    Remove-Item -Recurse -Force $dest
}

# Copiar pasta
Write-Host "📁 Copiando arquivos..." -ForegroundColor Yellow
Copy-Item -Recurse $source $dest

# Limpar referências de workspace no package.json
Write-Host "🔧 Corrigindo package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "$dest\package.json" -Raw
$packageJson = $packageJson -replace '"workspace:\*"', '"*"'
$packageJson = $packageJson -replace '@filazero/types.*",', ''
$packageJson = $packageJson -replace '@filazero/firebase.*",', ''
Set-Content "$dest\package.json" $packageJson

# Entrar na pasta e fazer deploy
Set-Location $dest
Write-Host "🌐 Iniciando deploy na Vercel..." -ForegroundColor Cyan
npx vercel --prod

Write-Host "✅ Deploy iniciado!" -ForegroundColor Green

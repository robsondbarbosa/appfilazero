# Quick Fix - Deploy sem Workspaces
$source = "C:\Users\RTI\.verdent\verdent-projects\filazero\apps\web"
$dest = "C:\Users\RTI\.verdent\verdent-projects\appfilazero-web"

Write-Host "Preparando deploy..." -ForegroundColor Green

# Remover pasta antiga se existir
if (Test-Path $dest) {
    Remove-Item -Recurse -Force $dest
}

# Criar pasta de destino
New-Item -ItemType Directory -Path $dest -Force

# Copiar arquivos
Write-Host "Copiando arquivos..." -ForegroundColor Yellow
Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force

# Verificar se package.json existe
if (-not (Test-Path "$dest\package.json")) {
    Write-Host "Erro: package.json nao encontrado!" -ForegroundColor Red
    exit 1
}

# Corrigir package.json
Write-Host "Corrigindo package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "$dest\package.json" -Raw
$packageJson = $packageJson -replace '"workspace:\*"', '"*"'
Set-Content "$dest\package.json" $packageJson

# Deploy
Set-Location $dest
Write-Host "Iniciando deploy..." -ForegroundColor Cyan
npx vercel --prod

Write-Host "Deploy concluido!" -ForegroundColor Green

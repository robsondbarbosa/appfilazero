# Push seguro para GitHub
# Este script usa variáveis de ambiente para o token (mais seguro)

Write-Host "🚀 Push seguro para GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Nunca salve tokens diretamente em arquivos!" -ForegroundColor Yellow
Write-Host ""

# Verificar se o token está configurado como variável de ambiente
$token = $env:GITHUB_TOKEN

if (-not $token) {
    Write-Host "❌ Token não encontrado nas variáveis de ambiente." -ForegroundColor Red
    Write-Host ""
    Write-Host "Configure o token executando:" -ForegroundColor Cyan
    Write-Host "  [Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'seu-token-aqui', 'User')" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou use o GitHub Desktop: https://desktop.github.com" -ForegroundColor Cyan
    exit 1
}

# Obter o diretório do script atual
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "📤 Enviando código..." -ForegroundColor Yellow

# Configurar remote temporariamente (não salva no arquivo)
$remoteUrl = "https://robsondbarbosa:${token}@github.com/robsondbarbosa/filazero.git"
git remote set-url origin $remoteUrl

# Fazer push
try {
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Código enviado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao enviar. Verifique:" -ForegroundColor Red
        Write-Host "   - Se o token tem permissões de repo" -ForegroundColor Yellow
        Write-Host "   - Se há conflitos (execute: git pull origin main primeiro)" -ForegroundColor Yellow
    }
} finally {
    # Limpar URL do remote (segurança)
    git remote set-url origin https://github.com/robsondbarbosa/filazero.git
}

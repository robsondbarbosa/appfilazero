cd C:\Users\RTI\.verdent\verdent-projects\filazero

# Configurar remote com token
git remote set-url origin https://robsondbarbosa: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@github.com/robsondbarbosa/filazero.git

# Verificar se está configurado corretamente
git remote -v

# Enviar código para o GitHub
git push -u origin main --force

Write-Host "✅ Codigo enviado com sucesso!" -ForegroundColor Green
Write-Host "🌐 Acesse: https://github.com/robsondbarbosa/filazero" -ForegroundColor Cyan

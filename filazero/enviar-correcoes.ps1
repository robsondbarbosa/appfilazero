cd C:\Users\RTI\.verdent\verdent-projects\filazero

# Configurar remote
git remote add origin https://robsondbarbosa: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@github.com/robsondbarbosa/filazero.git 2>$null

# Forçar push das correções
git push origin main --force

Write-Host "✅ Correções enviadas!" -ForegroundColor Green

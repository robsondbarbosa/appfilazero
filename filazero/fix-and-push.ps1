cd C:\Users\RTI\.verdent\verdent-projects\filazero

# Remover pasta de backup (contém token no histórico)
Remove-Item -Recurse -Force .git_backup -ErrorAction SilentlyContinue

# Adicionar mudanças
git add -A

# Commit
git commit -m "Remove backup com token e adiciona scripts seguros"

# Forçar push
git push origin main --force

Write-Host "✅ Enviado!" -ForegroundColor Green

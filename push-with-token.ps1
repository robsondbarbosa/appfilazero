# Configurar Git com Token
# Execute estes comandos no PowerShell:

cd C:\Users\RTI\.verdent\verdent-projects\filazero

# Configurar remote com token
git remote set-url origin https://robsondbarbosa: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@github.com/robsondbarbosa/filazero.git

# Verificar remote
git remote -v

# Fazer push
git push -u origin main --force

# Se der erro de repositório não existente, crie primeiro em:
# https://github.com/new (nome: filazero, público)

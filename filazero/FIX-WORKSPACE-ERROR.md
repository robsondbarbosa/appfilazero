# Como resolver erro de workspace no deploy

## ❌ Erro: EUNSUPPORTEDPROTOCOL - workspace:*

O projeto usa monorepo com workspaces. A Vercel não suporta isso diretamente.

## ✅ Solução 1: Deploy da pasta web isolada

### Passo 1: Copiar pasta web para fora do monorepo
```powershell
cd C:\Users\RTI\.verdent\verdent-projects
Copy-Item -Recurse filazero\apps\web appfilazero-deploy
```

### Passo 2: Modificar package.json
No arquivo `appfilazero-deploy\package.json`, remova:
```json
"workspaces": [...]
```

E mude as dependências de workspace para versão real:
- `"@filazero/types": "workspace:*"` → `"@filazero/types": "1.0.0"`
- `"@filazero/firebase": "workspace:*"` → `"@filazero/firebase": "1.0.0"`

### Passo 3: Deploy
```powershell
cd appfilazero-deploy
npx vercel --prod
```

## ✅ Solução 2: Usar pnpm (recomendado pela Vercel)

Crie arquivo `vercel.json` na raiz:
```json
{
  "packageManager": "pnpm@8.15.0"
}
```

E mude o install command para:
```
pnpm install
```

## ✅ Solução 3: Deploy manual via upload

1. Compacte a pasta `apps/web`
2. Acesse https://vercel.com/new
3. Faça upload do ZIP
4. Configure como Next.js

---

## 🔧 Quick Fix

Execute este script no PowerShell:

```powershell
# Criar pasta de deploy isolada
$source = "C:\Users\RTI\.verdent\verdent-projects\filazero\apps\web"
$dest = "C:\Users\RTI\.verdent\verdent-projects\appfilazero-web"

# Copiar
Copy-Item -Recurse $source $dest

# Limpar referências de workspace
(Get-Content "$dest\package.json") -replace '"workspace:\*"', '"*"' | Set-Content "$dest\package.json"

# Deploy
cd $dest
npx vercel --prod
```

---

**Recomendo a Solução 1 ou o Quick Fix!**

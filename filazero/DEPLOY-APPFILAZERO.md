# Deploy - App FilaZero
# Repositorio: https://github.com/robsondbarbosa/appfilazero

## 🚀 Deploy na Vercel

### Passo 1: Acesse
https://vercel.com/new

### Passo 2: Importe o repositorio
- Cole a URL: `https://github.com/robsondbarbosa/appfilazero`
- Ou busque por "appfilazero" na lista

### Passo 3: Configure
- **Framework Preset:** Next.js
- **Root Directory:** (deixe em branco ou ./)
- **Build Command:** npm run build

### Passo 4: Deploy
Clique em "Deploy"

---

## ⚠️ Configuracao Firebase (Obrigatorio)

Apos o deploy, configure as variaveis de ambiente:

1. No dashboard da Vercel, va em "Settings" → "Environment Variables"
2. Adicione:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## ❓ Problemas?

Se o repositorio nao for encontrado:
1. Verifique se ele existe: https://github.com/robsondbarbosa/appfilazero
2. Verifique se e publico
3. Ou use o repositorio antigo: https://github.com/robsondbarbosa/filazero

---

**Data:** 2024

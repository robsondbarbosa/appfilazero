# Deploy na Vercel - Instruções Rápidas

## 🚀 Método 1: Interface Web (Recomendado)

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Cole a URL: `https://github.com/robsondbarbosa/filazero`
4. Clique em **"Import"**
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
6. Clique em **"Deploy"**

---

## 💻 Método 2: CLI (Terminal)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod
```

---

## ⚙️ Configuração de Variáveis de Ambiente

Após o deploy, configure na Vercel:

1. Vá em **"Settings"** → **"Environment Variables"**
2. Adicione:

```
NEXT_PUBLIC_FIREBASE_API_KEY=seu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 🌐 URL Esperada

Após deploy: `https://filazero.vercel.app`

---

## ❓ Problemas?

Se der erro "Project not found":
- Crie um novo projeto na Vercel
- Importe do GitHub

Se der erro de build:
- Verifique se o Node.js está instalado
- Execute `npm install` na pasta `apps/web`

---

**Status:** ✅ Repositório pronto para deploy!

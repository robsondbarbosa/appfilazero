# Deploy na Vercel - Passo a Passo

## 🚀 Opção 1: Via Interface Web (Recomendado)

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Cole a URL: `https://github.com/robsondbarbosa/filazero`
4. Clique em **"Import"**
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. Clique em **"Deploy"**

## 🌐 Configurar Domínio Personalizado

Após o deploy:

1. No dashboard da Vercel, clique no projeto
2. Vá em **"Settings"** → **"Domains"**
3. Adicione seu domínio (ex: `filazero.com.br`)
4. Siga as instruções de DNS

## 🔧 Variáveis de Ambiente

Configure no painel da Vercel (Settings → Environment Variables):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 💻 Opção 2: Via CLI

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

## ✅ Status

- [x] Repositório no GitHub
- [x] Código atualizado
- [x] Configuração Vercel criada
- [ ] Deploy na Vercel ← **Próximo passo**
- [ ] Domínio configurado

**URL temporária após deploy:** `https://filazero.vercel.app`

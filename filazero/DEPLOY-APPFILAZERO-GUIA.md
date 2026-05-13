# Deploy AppFilaZero
# Repositorio: https://github.com/robsondbarbosa/appfilazero

## 🚀 Deploy na Vercel - Passo a Passo

### Metodo 1: Interface Web (Recomendado)

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Cole a URL: `https://github.com/robsondbarbosa/appfilazero`
4. Clique em **"Import"**
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
6. Clique em **"Deploy"**

### Metodo 2: CLI

```bash
# Clone o repositorio
git clone https://github.com/robsondbarbosa/appfilazero.git

# Entre na pasta
cd appfilazero

# Instale dependencias
npm install

# Deploy
npx vercel --prod
```

---

## ⚙️ Configuracao de Variaveis de Ambiente

Apos o deploy, configure no dashboard da Vercel:

### Firebase (Obrigatorio)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Mercado Pago (Opcional)
```
NEXT_PUBLIC_MP_PUBLIC_KEY=
MP_ACCESS_TOKEN=
```

---

## 🌐 URL do Deploy

Apos configurar: `https://appfilazero.vercel.app`

---

## ❓ Problemas Comuns

**"Project not found"**
- Crie um novo projeto na Vercel
- Importe do GitHub novamente

**"Build failed"**
- Verifique se o Node.js esta instalado
- Execute `npm install` antes do deploy

**"Firebase not initialized"**
- Configure as variaveis de ambiente do Firebase

---

**Status:** ✅ Repositorio pronto para deploy!

# Deploy Direto na Vercel

## Opção 1: Via Interface Web (Mais Fácil)

1. Acesse: https://vercel.com/new
2. Clique em "Import Git Repository"
3. Cole a URL: `https://github.com/robsondbarbosa/filazero`
4. Se der erro (repo não existe), use a Opção 2

## Opção 2: Deploy via Upload

1. Compacte a pasta `filazero` em ZIP
2. Acesse: https://vercel.com/new
3. Clique em "Upload"
4. Selecione o arquivo ZIP
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: apps/web
   - Build Command: npm run build
   - Output Directory: .next

## Opção 3: CLI (Terminal)

Execute no PowerShell:

```powershell
cd C:\Users\RTI\.verdent\verdent-projects\filazero\apps\web

# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Variáveis de Ambiente Necessárias

Configure estas variáveis no painel da Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## Status do Projeto

✅ **90% Concluído**
- Dashboard criado
- Agendamento funcionando
- Notificações configuradas
- Pagamentos integrados

❌ **Pendente: Deploy**
- Repositório GitHub não existe
- Firebase não configurado
- Vercel não configurado

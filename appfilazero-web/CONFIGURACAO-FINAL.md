# 🔓 Tornar Site Público + Configurar Firebase

## PARTE 1: Tornar o Site Público

### Passo 1: Acessar Dashboard da Vercel
1. Vá para: https://vercel.com/dashboard
2. Faça login com sua conta (robsondbarbosa)
3. Clique no projeto **"web"** (ou appfilazero)

### Passo 2: Configurar Acesso Público
1. No projeto, clique em **"Settings"** (engrenagem no topo)
2. No menu lateral, clique em **"General"**
3. Role até **"Deployment Protection"**
4. Selecione **"Public"** (ou desative a proteção)
5. Clique em **"Save"**

✅ Pronto! O site agora está acessível sem login.

---

## PARTE 2: Configurar Firebase com Credenciais Reais

### Passo 1: Pegar Credenciais do Firebase

Se você já tem o projeto Firebase criado:

1. Acesse: https://console.firebase.google.com/project/appfilazero/settings/general
2. Role até **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. Copie o `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
  authDomain: "appfilazero.firebaseapp.com",
  projectId: "appfilazero",
  storageBucket: "appfilazero.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxx"
};
```

### Passo 2: Configurar na Vercel

1. No dashboard da Vercel, vá em **"Settings"** → **"Environment Variables"**
2. Adicione estas 6 variáveis:

| Nome | Valor (cole aqui) |
|------|-------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `appfilazero.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `appfilazero` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `appfilazero.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:...:web:...` |

3. Clique **"Save"**

### Passo 3: Redeploy

1. No dashboard da Vercel, vá em **"Deployments"**
2. Clique nos **3 pontos** do deploy mais recente
3. Clique em **"Redeploy"**

✅ Pronto! O Firebase está configurado!

---

## 🆘 Não tem o projeto Firebase criado?

Se ainda não criou o projeto no Firebase:

### Criar Projeto Firebase:
1. Acesse: https://console.firebase.google.com
2. Clique **"Criar um projeto"**
3. Nome: `appfilazero`
4. Clique **"Continuar"** → **"Criar projeto"**

### Adicionar App Web:
1. No Firebase, clique **"</>"** (ícone Web)
2. Nome do app: `AppFilaZero Web`
3. Clique **"Registrar app"**
4. Copie as credenciais e siga o Passo 2 acima

### Ativar Serviços:
1. **Authentication**: Ative Email/Senha e Google
2. **Firestore Database**: Crie banco de dados (modo teste)

---

## ✅ Checklist Final

- [ ] Site configurado como Público na Vercel
- [ ] Variáveis de ambiente do Firebase adicionadas
- [ ] Redeploy realizado
- [ ] Testar acesso ao site
- [ ] Testar login no app

---

**Precisa de ajuda em algum passo?**

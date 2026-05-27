# 🚨 ERRO DE DEPLOY - Firebase Não Configurado

## ❌ Problema
O build está falhando porque o Firebase não tem uma API key válida configurada.

**Erro:** `Firebase: Error (auth/invalid-api-key)`

## ✅ Solução

Você precisa configurar as variáveis de ambiente do Firebase na Vercel:

### Passo 1: Criar Projeto Firebase
1. Acesse: https://console.firebase.google.com
2. Clique em "Criar um projeto"
3. Nome: `appfilazero`
4. Clique em "Continuar" → "Criar projeto"

### Passo 2: Adicionar App Web
1. No Firebase, clique no ícone `</>` (Web)
2. Nome: `AppFilaZero Web`
3. Clique em "Registrar app"
4. **Copie as credenciais:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← COPIE ESTE
  authDomain: "appfilazero.firebaseapp.com",  // ← COPIE ESTE
  projectId: "appfilazero",         // ← COPIE ESTE
  storageBucket: "appfilazero.appspot.com",   // ← COPIE ESTE
  messagingSenderId: "123456789",   // ← COPIE ESTE
  appId: "1:123456789:web:abcdef"   // ← COPIE ESTE
};
```

### Passo 3: Configurar na Vercel
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto `web` (appfilazero)
3. Vá em **"Settings"** → **"Environment Variables"**
4. Adicione estas 6 variáveis:

| Nome | Valor (cole aqui) |
|------|-------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `appfilazero.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `appfilazero` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `appfilazero.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789:web:abcdef` |

5. Clique em **"Save"**

### Passo 4: Redeploy
```bash
cd C:\Users\RTI\.verdent\verdent-projects\appfilazero-web
npx vercel --prod
```

---

## 🆘 Alternativa: Desativar Firebase Temporariamente

Se quiser ver o site funcionando SEM o Firebase (só o layout):

Edite `lib/firebase/client.ts` e comente as linhas do Firebase.

**Mas recomendo fortemente configurar o Firebase para o app funcionar 100%!**

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas em algum passo, me avise!

# Configuração de Deploy - FilaZero
# Leia este arquivo antes de executar qualquer script

## ⚠️ SEGURANÇA - Tokens e Credenciais

### ❌ NUNCA faça isso:
- Salvar tokens diretamente em arquivos .ps1, .bat, .sh
- Commitar arquivos com tokens no GitHub
- Compartilhar tokens em mensagens não criptografadas

### ✅ Forma segura de usar tokens:

#### Opção 1: Variáveis de Ambiente (Recomendado)

```powershell
# Configure uma vez no seu sistema
[Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'seu-token-aqui', 'User')

# Depois use o script push-seguro.ps1
.\push-seguro.ps1
```

#### Opção 2: GitHub Desktop (Mais fácil)
Baixe: https://desktop.github.com

#### Opção 3: Git Credential Manager
```bash
git config --global credential.helper cache
git push origin main
# Digite usuário e token quando solicitado
```

---

## 🚀 Como fazer Deploy

### Passo 1: Preparação
1. Instale Node.js: https://nodejs.org
2. Instale Git: https://git-scm.com

### Passo 2: Clone o repositório
```bash
git clone https://github.com/robsondbarbosa/filazero.git
cd filazero
```

### Passo 3: Instale dependências
```bash
npm install
```

### Passo 4: Deploy na Vercel
```bash
cd apps/web
npx vercel --prod
```

Ou execute o script portátil:
```powershell
.\deploy-portable.ps1
```

---

## 📁 Estrutura do Projeto

```
filazero/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend Express
├── packages/
│   ├── types/        # TypeScript types
│   └── firebase/     # Config Firebase
├── push-seguro.ps1   # ✅ Script seguro
├── deploy-portable.ps1  # ✅ Script portátil
└── README.md
```

---

## 🔧 Configuração Firebase (Obrigatório)

O projeto precisa de um projeto Firebase configurado:

1. Acesse: https://console.firebase.google.com
2. Crie um novo projeto
3. Ative Authentication e Firestore
4. Copie as credenciais
5. Configure na Vercel como variáveis de ambiente

---

## ❓ Problemas Comuns

### "Token inválido"
- O token foi revogado. Crie um novo em: https://github.com/settings/tokens

### "Repository not found"
- Verifique se tem acesso ao repositório
- Ou faça um fork para sua conta

### "Deploy falhou"
- Verifique se o Node.js está instalado
- Verifique se a pasta `apps/web` existe

---

## 📞 Suporte

Se tiver problemas, verifique:
1. Se o Node.js está instalado: `node --version`
2. Se o Git está instalado: `git --version`
3. Se tem acesso ao repositório no GitHub

---

**Última atualização:** 2024
**Versão:** 1.0

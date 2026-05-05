# FilaZero - Sistema de Agendamento Multi-Estabelecimentos

Sistema completo de agendamento online para salões de beleza e barbearias, com suporte a múltiplos estabelecimentos, pagamentos via PIX e cartão, e gestão de profissionais.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: Firebase Firestore (NoSQL)
- **Autenticação**: Firebase Authentication (Google + Email/Senha)
- **Pagamento**: Mercado Pago SDK
- **Deploy**: Vercel (frontend) + Firebase (backend)

## 📁 Estrutura do Projeto

```
filazero/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # Express backend
├── packages/
│   ├── types/                  # TypeScript types compartilhados
│   └── firebase/               # Config Firebase (client + admin)
├── firestore.rules             # Regras de segurança
├── firestore.indexes.json      # Índices Firestore
└── firebase.json               # Config Firebase
```

## 🎨 Identidade Visual

- **Cores**: Dourado (#D4AF37), Preto (#1A1A1A)
- **Tipografia**: Montserrat (títulos), Poppins (corpo)
- **Slogan**: "Agendou, chegou. Sem fila."

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/filazero.git
cd filazero
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

#### Frontend (`apps/web/.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (`apps/api/.env`)
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

MP_MASTER_ACCESS_TOKEN=TEST-...

RESEND_API_KEY=re_...
EMAIL_FROM=noreply@filazero.com.br

WEB_URL=http://localhost:3000
API_URL=http://localhost:3001
```

### 4. Inicie o ambiente de desenvolvimento

```bash
# Terminal 1 - Frontend
cd apps/web
npm run dev

# Terminal 2 - Backend
cd apps/api
npm run dev
```

## 📋 Funcionalidades

### ✅ Implementadas

- [x] Estrutura de monorepo com Turborepo
- [x] Configuração Firebase (Auth, Firestore, Storage)
- [x] Frontend Next.js com design FilaZero
- [x] Autenticação (Email/Senha + Google)
- [x] APIs REST (Tenants, Services, Professionals)
- [x] Sistema de agendamento com prevenção de double-booking
- [x] Integração Mercado Pago (PIX e Cartão)
- [x] Webhooks para confirmação de pagamento

### 🚧 Em desenvolvimento

- [ ] Cloud Functions (cancelar expirados, lembretes)
- [ ] Dashboard administrativo
- [ ] Relatórios e analytics
- [ ] PWA para profissionais
- [ ] CI/CD com GitHub Actions

## 🔒 Segurança

- **Isolamento Multi-Tenant**: Cada estabelecimento só acessa seus próprios dados
- **Prevenção de Double-Booking**: Firestore transactions garantem atomicidade
- **Regras Firestore**: Controle granular de permissões
- **Rate Limiting**: Proteção contra abuso de APIs

## 📦 Deploy

### Firebase

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Vercel (Frontend)

```bash
cd apps/web
vercel --prod
```

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com 💛 pela equipe FilaZero

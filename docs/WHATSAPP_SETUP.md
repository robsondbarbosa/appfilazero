# Configuração WhatsApp - FilaZero

## Opções de Integração

### 1. Evolution API (Recomendado para desenvolvimento)

A Evolution API é uma solução open-source que permite integrar com WhatsApp via Baileys ou WhatsApp Web.

#### Instalação via Docker

```bash
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=sua-chave-secreta \
  atendai/evolution-api:latest
```

#### Configuração no .env

```env
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_API_KEY=sua-chave-secreta
WHATSAPP_INSTANCE_NAME=filazero
```

#### Criar Instância

```bash
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: sua-chave-secreta" \
  -d '{
    "instanceName": "filazero",
    "qrcode": true,
    "webhook": {
      "url": "https://sua-api.com/webhooks/whatsapp",
      "enabled": true
    }
  }'
```

Escaneie o QR Code com seu WhatsApp para conectar.

---

### 2. WhatsApp Business API (Meta) - Recomendado para produção

Para uso em produção com volume alto, recomenda-se a API oficial do WhatsApp Business.

#### Pré-requisitos
- Conta Business verificada no Facebook
- Número de telefone dedicado
- Aprovação do WhatsApp

#### Configuração no .env

```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_API_KEY=seu-token-de-acesso
WHATSAPP_INSTANCE_NAME=seu-phone-number-id
WHATSAPP_BUSINESS_ACCOUNT_ID=seu-business-account-id
```

---

### 3. Twilio WhatsApp API

Alternativa simples com preço por mensagem.

#### Configuração no .env

```env
WHATSAPP_API_URL=https://api.twilio.com/2010-04-01
WHATSAPP_API_KEY=seu-account-sid:seu-auth-token
WHATSAPP_INSTANCE_NAME=seu-twilio-number
```

---

## Templates de Mensagens

### Confirmação de Agendamento

```
✅ *Agendamento Confirmado!*

Olá {{clientName}}! 👋

Seu agendamento em *{{tenantName}}* foi confirmado:

📋 *Serviço:* {{serviceName}}
💇‍♂️ *Profissional:* {{professionalName}}
📅 *Data:* {{dateTime}}
💰 *Valor:* {{price}}
📍 *Endereço:* {{address}}

⏰ *Chegue 10 minutos antes do horário.*

📞 Dúvidas? Fale conosco: {{tenantPhone}}

Agradecemos a preferência! 💛
```

### Lembrete de Agendamento

```
⏰ *Lembrete de Agendamento*

Olá {{clientName}}!

Passando para lembrar do seu agendamento amanhã:

📋 *Serviço:* {{serviceName}}
💇‍♂️ *Profissional:* {{professionalName}}
📅 *Data:* {{dateTime}}
🏢 *Local:* {{tenantName}}

⏰ *Não se esqueça de chegar 10 minutos antes.*

Te esperamos! 💛
```

### Parabéns de Aniversário

```
🎉 *Feliz Aniversário!* 🎂

Olá {{clientName}}!

A equipe do *{{tenantName}}* deseja um dia incrível e cheio de alegria! 🥳

Que seu novo ano de vida seja repleto de conquistas, saúde e momentos especiais.

🎁 *Presente especial:*
Use o código *{{discountCode}}* e ganhe *20% OFF* no seu próximo agendamento!

Válido por 7 dias. Não perca! 😉

Parabéns! 🎈🎊
```

---

## Testes

### Enviar mensagem de teste

```bash
curl -X POST http://localhost:3001/cron/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "5511999999999",
    "message": "Teste de mensagem FilaZero"
  }'
```

### Executar cron jobs manualmente

```bash
# Verificar aniversários
curl -X POST http://localhost:3001/cron/check-birthdays

# Enviar lembretes
curl -X POST http://localhost:3001/cron/send-reminders

# Cancelar expirados
curl -X POST http://localhost:3001/cron/cancel-expired
```

---

## Agendamento em Produção

### Usando node-cron

Adicione ao `server.ts`:

```typescript
import cron from 'node-cron';

// Todos os dias às 9h - Verificar aniversários
cron.schedule('0 9 * * *', () => {
  console.log('[Cron] Executando verificação de aniversários...');
  checkBirthdaysAndNotify();
});

// Todos os dias às 9h - Enviar lembretes
cron.schedule('0 9 * * *', () => {
  console.log('[Cron] Enviando lembretes...');
  sendAppointmentReminders();
});

// A cada 5 minutos - Cancelar expirados
cron.schedule('*/5 * * * *', () => {
  cancelExpiredAppointments();
});
```

### Usando Firebase Cloud Scheduler

Deploy das funções:

```bash
firebase deploy --only functions
```

---

## Logs e Monitoramento

Todas as notificações são registradas na coleção `notificationLogs`:

```javascript
{
  type: 'APPOINTMENT_CONFIRMATION',
  phoneNumber: '5511999999999',
  status: 'SENT', // ou 'FAILED'
  data: { ... },
  createdAt: Timestamp
}
```

---

## Troubleshooting

### Mensagens não estão sendo enviadas

1. Verifique se a instância WhatsApp está conectada
2. Confirme as variáveis de ambiente
3. Verifique os logs da API
4. Confirme se o número está formatado corretamente

### Rate Limiting

A Evolution API tem limites de envio. Para alto volume, considere:
- WhatsApp Business API oficial
- Múltiplas instâncias
- Fila de mensagens (Redis/RabbitMQ)

---

## Segurança

- Nunca commit suas chaves de API
- Use variáveis de ambiente
- Restrinja IPs no firewall
- Monitore uso e custos

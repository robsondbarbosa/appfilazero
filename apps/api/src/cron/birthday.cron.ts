import { adminDb } from '@filazero/firebase';
import { notificationService } from '../services/notification.service';

/**
 * Verifica aniversários do dia e envia mensagens de parabéns
 * Deve ser executada diariamente às 9h da manhã
 */
export async function checkBirthdaysAndNotify(): Promise<void> {
  try {
    console.log('[Birthday] Verificando aniversários do dia...');
    
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // 1-12
    const todayDay = today.getDate(); // 1-31
    
    // Buscar todos os tenants ativos
    const tenantsSnapshot = await adminDb
      .collection('tenants')
      .where('isActive', '==', true)
      .get();
    
    console.log(`[Birthday] Verificando ${tenantsSnapshot.size} estabelecimentos`);
    
    for (const tenantDoc of tenantsSnapshot.docs) {
      const tenant = tenantDoc.data();
      const tenantId = tenantDoc.id;
      
      // Buscar clientes que fizeram agendamentos neste tenant
      // e que fazem aniversário hoje
      const appointmentsSnapshot = await adminDb
        .collection('appointments')
        .where('tenantId', '==', tenantId)
        .get();
      
      // Agrupar clientes únicos por email
      const uniqueClients = new Map();
      
      appointmentsSnapshot.docs.forEach(doc => {
        const appointment = doc.data();
        const clientKey = appointment.clientEmail;
        
        if (!uniqueClients.has(clientKey)) {
          uniqueClients.set(clientKey, {
            name: appointment.clientName,
            phone: appointment.clientPhone,
            email: appointment.clientEmail,
            birthDate: appointment.clientBirthDate // Se tiver sido coletado
          });
        }
      });
      
      // Verificar aniversários (se tivermos a data de nascimento)
      for (const [email, client] of uniqueClients) {
        if (client.birthDate) {
          const birthDate = client.birthDate.toDate ? client.birthDate.toDate() : new Date(client.birthDate);
          const birthMonth = birthDate.getMonth() + 1;
          const birthDay = birthDate.getDate();
          
          if (birthMonth === todayMonth && birthDay === todayDay) {
            console.log(`[Birthday] Aniversário encontrado: ${client.name} (${email})`);
            
            // Gerar código de desconto único
            const discountCode = `NIVERS${todayDay}${todayMonth}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            
            // Enviar mensagem de parabéns
            const sent = await notificationService.sendBirthdayMessage({
              clientName: client.name,
              clientPhone: client.phone,
              tenantName: tenant.name,
              discountCode
            });
            
            if (sent) {
              // Salvar código de desconto no Firestore
              await adminDb.collection('birthdayDiscounts').add({
                tenantId,
                clientEmail: email,
                clientName: client.name,
                code: discountCode,
                discount: 20, // 20%
                validUntil: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias
                used: false,
                createdAt: new Date()
              });
              
              console.log(`[Birthday] Mensagem enviada para ${client.name} com código ${discountCode}`);
            }
          }
        }
      }
    }
    
    console.log('[Birthday] Verificação de aniversários concluída');
  } catch (error) {
    console.error('[Birthday] Erro ao verificar aniversários:', error);
  }
}

/**
 * Agenda de execução: todos os dias às 9h
 * Esta função deve ser chamada por um agendador (node-cron, Cloud Scheduler, etc)
 */
export function scheduleBirthdayCheck(): void {
  // Se estiver usando node-cron:
  // cron.schedule('0 9 * * *', checkBirthdaysAndNotify);
  
  // Se estiver usando Firebase Cloud Scheduler:
  // A função será acionada automaticamente pelo Cloud Scheduler
  
  console.log('[Birthday] Agendamento configurado para 9h diariamente');
}

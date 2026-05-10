import { adminDb } from '@filazero/firebase';
import { notificationService } from '../services/notification.service';

/**
 * Cancela agendamentos não pagos após 15 minutos
 * Envia notificação WhatsApp de cancelamento
 */
export async function cancelExpiredAppointments(): Promise<void> {
  try {
    console.log('[Cron] Verificando agendamentos expirados...');
    
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const expiredSnapshot = await adminDb
      .collection('appointments')
      .where('status', '==', 'PENDING')
      .where('createdAt', '<=', fifteenMinutesAgo)
      .get();
    
    console.log(`[Cron] ${expiredSnapshot.size} agendamentos expirados encontrados`);
    
    for (const doc of expiredSnapshot.docs) {
      const appointment = doc.data();
      const appointmentId = doc.id;
      
      // Cancelar agendamento
      await adminDb.collection('appointments').doc(appointmentId).update({
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'Não pagamento dentro do prazo',
        updatedAt: new Date()
      });
      
      // Atualizar pagamento
      await adminDb.collection('payments').doc(appointmentId).update({
        status: 'REJECTED',
        updatedAt: new Date()
      });
      
      // Enviar notificação WhatsApp de cancelamento
      try {
        const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
          adminDb.collection('services').doc(appointment.serviceId).get(),
          adminDb.collection('professionals').doc(appointment.professionalId).get(),
          adminDb.collection('tenants').doc(appointment.tenantId).get()
        ]);
        
        const service = serviceDoc.data();
        const professional = professionalDoc.data();
        const tenant = tenantDoc.data();
        
        await notificationService.sendCancellationNotification(
          {
            clientName: appointment.clientName,
            clientPhone: appointment.clientPhone,
            serviceName: service?.name || 'Serviço',
            professionalName: professional?.name || 'Profissional',
            dateTime: appointment.dateTime.toDate(),
            price: appointment.price,
            tenantName: tenant?.name || 'Estabelecimento'
          },
          'Não pagamento dentro do prazo de 15 minutos'
        );
        
        console.log(`[WhatsApp] Cancelamento notificado: ${appointment.clientPhone}`);
      } catch (notifyError) {
        console.error('[WhatsApp] Erro ao notificar cancelamento:', notifyError);
      }
    }
    
    console.log(`[Cron] ${expiredSnapshot.size} agendamentos cancelados`);
  } catch (error) {
    console.error('[Cron] Erro ao cancelar agendamentos:', error);
  }
}

/**
 * Envia lembretes de agendamento 2h antes
 */
export async function sendAppointmentReminders(): Promise<void> {
  try {
    console.log('[Cron] Enviando lembretes de agendamento...');
    
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    
    const appointmentsSnapshot = await adminDb
      .collection('appointments')
      .where('status', '==', 'CONFIRMED')
      .where('dateTime', '>=', twoHoursFromNow)
      .where('dateTime', '<', threeHoursFromNow)
      .where('reminderSent', '!=', true)
      .get();
    
    console.log(`[Cron] ${appointmentsSnapshot.size} lembretes para enviar`);
    
    for (const doc of appointmentsSnapshot.docs) {
      const appointment = doc.data();
      
      try {
        const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
          adminDb.collection('services').doc(appointment.serviceId).get(),
          adminDb.collection('professionals').doc(appointment.professionalId).get(),
          adminDb.collection('tenants').doc(appointment.tenantId).get()
        ]);
        
        const service = serviceDoc.data();
        const professional = professionalDoc.data();
        const tenant = tenantDoc.data();
        
        await notificationService.sendAppointmentReminder({
          clientName: appointment.clientName,
          clientPhone: appointment.clientPhone,
          serviceName: service?.name || 'Serviço',
          professionalName: professional?.name || 'Profissional',
          dateTime: appointment.dateTime.toDate(),
          price: appointment.price,
          tenantName: tenant?.name || 'Estabelecimento'
        });
        
        // Marcar como lembrete enviado
        await doc.ref.update({
          reminderSent: true,
          reminderSentAt: new Date()
        });
        
        console.log(`[WhatsApp] Lembrete enviado: ${appointment.clientPhone}`);
      } catch (notifyError) {
        console.error('[WhatsApp] Erro ao enviar lembrete:', notifyError);
      }
    }
    
    console.log('[Cron] Lembretes enviados com sucesso');
  } catch (error) {
    console.error('[Cron] Erro ao enviar lembretes:', error);
  }
}

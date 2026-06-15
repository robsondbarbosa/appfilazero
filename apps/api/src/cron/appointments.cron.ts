import { db as adminDb } from '@filazero/firebase/admin';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { notificationService } from '../services/notification.service';

export async function cancelExpiredAppointments(): Promise<void> {
  try {
    console.log('[Cron] Verificando agendamentos expirados...');

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const expiredSnapshot = await getDocs(
      query(
        collection(adminDb, 'appointments'),
        where('status', '==', 'PENDING'),
        where('createdAt', '<=', fifteenMinutesAgo)
      )
    );

    console.log(`[Cron] ${expiredSnapshot.size} agendamentos expirados encontrados`);

    for (const appointmentDoc of expiredSnapshot.docs) {
      const appointment = appointmentDoc.data();
      const appointmentId = appointmentDoc.id;

      await updateDoc(doc(adminDb, 'appointments', appointmentId), {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'NÃ£o pagamento dentro do prazo',
        updatedAt: new Date()
      });

      await updateDoc(doc(adminDb, 'payments', appointmentId), {
        status: 'REJECTED',
        updatedAt: new Date()
      });

      try {
        const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
          getDoc(doc(adminDb, 'services', appointment.serviceId)),
          getDoc(doc(adminDb, 'professionals', appointment.professionalId)),
          getDoc(doc(adminDb, 'tenants', appointment.tenantId))
        ]);

        const service = serviceDoc.data();
        const professional = professionalDoc.data();
        const tenant = tenantDoc.data();

        await notificationService.sendCancellationNotification(
          {
            clientName: appointment.clientName,
            clientPhone: appointment.clientPhone,
            serviceName: service?.name || 'ServiÃ§o',
            professionalName: professional?.name || 'Profissional',
            dateTime: appointment.dateTime.toDate(),
            price: appointment.price,
            tenantName: tenant?.name || 'Estabelecimento'
          },
          'NÃ£o pagamento dentro do prazo de 15 minutos'
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

export async function sendAppointmentReminders(): Promise<void> {
  try {
    console.log('[Cron] Enviando lembretes de agendamento...');

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const appointmentsSnapshot = await getDocs(
      query(
        collection(adminDb, 'appointments'),
        where('status', '==', 'CONFIRMED'),
        where('dateTime', '>=', twoHoursFromNow),
        where('dateTime', '<', threeHoursFromNow),
        where('reminderSent', '!=', true)
      )
    );

    console.log(`[Cron] ${appointmentsSnapshot.size} lembretes para enviar`);

    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointment = appointmentDoc.data();

      try {
        const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
          getDoc(doc(adminDb, 'services', appointment.serviceId)),
          getDoc(doc(adminDb, 'professionals', appointment.professionalId)),
          getDoc(doc(adminDb, 'tenants', appointment.tenantId))
        ]);

        const service = serviceDoc.data();
        const professional = professionalDoc.data();
        const tenant = tenantDoc.data();

        await notificationService.sendAppointmentReminder({
          clientName: appointment.clientName,
          clientPhone: appointment.clientPhone,
          serviceName: service?.name || 'ServiÃ§o',
          professionalName: professional?.name || 'Profissional',
          dateTime: appointment.dateTime.toDate(),
          price: appointment.price,
          tenantName: tenant?.name || 'Estabelecimento'
        });

        await updateDoc(appointmentDoc.ref, {
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
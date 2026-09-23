import { db as adminDb } from '@filazero/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { notificationService } from '../services/notification.service';

const appointmentsCollection = adminDb.collection('appointments');
const paymentsCollection = adminDb.collection('payments');
const servicesCollection = adminDb.collection('services');
const professionalsCollection = adminDb.collection('professionals');
const tenantsCollection = adminDb.collection('tenants');

export async function cancelExpiredAppointments(): Promise<void> {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const expiredSnapshot = await appointmentsCollection
      .where('status', '==', 'PENDING')
      .where('createdAt', '<=', fifteenMinutesAgo)
      .get();

    for (const appointmentDoc of expiredSnapshot.docs) {
      const appointment = appointmentDoc.data();
      const appointmentId = appointmentDoc.id;

      await appointmentsCollection.doc(appointmentId).update({
        status: 'CANCELLED',
        cancelledAt: FieldValue.serverTimestamp(),
        cancelReason: 'Não pagamento dentro do prazo',
        updatedAt: FieldValue.serverTimestamp()
      });

      await paymentsCollection.doc(appointmentId).update({
        status: 'REJECTED',
        updatedAt: FieldValue.serverTimestamp()
      });

      try {
        const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
          servicesCollection.doc(String(appointment.serviceId)).get(),
          professionalsCollection.doc(String(appointment.professionalId)).get(),
          tenantsCollection.doc(String(appointment.tenantId)).get()
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
            dateTime: (appointment.dateTime as FirebaseFirestore.Timestamp).toDate(),
            price: appointment.price,
            tenantName: tenant?.name || 'Estabelecimento'
          },
          'Não pagamento dentro do prazo de 15 minutos'
        );
      } catch (notifyError) {
        console.error('[WhatsApp] Erro ao notificar cancelamento:', notifyError);
      }
    }
  } catch (error) {
    console.error('[Cron] Erro ao cancelar agendamentos:', error);
  }
}

export async function sendAppointmentReminders(): Promise<void> {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const appointmentsSnapshot = await appointmentsCollection
      .where('status', '==', 'CONFIRMED')
      .where('dateTime', '>=', twoHoursFromNow)
      .where('dateTime', '<', threeHoursFromNow)
      .where('reminderSent', '!=', true)
      .get();

    for (const appointmentDoc of appointmentsSnapshot.docs) {
      const appointment = appointmentDoc.data();

      try {
        const [serviceDoc, professionalDoc, tenantDoc] = await Promise.all([
          servicesCollection.doc(String(appointment.serviceId)).get(),
          professionalsCollection.doc(String(appointment.professionalId)).get(),
          tenantsCollection.doc(String(appointment.tenantId)).get()
        ]);

        const service = serviceDoc.data();
        const professional = professionalDoc.data();
        const tenant = tenantDoc.data();

        await notificationService.sendAppointmentReminder({
          clientName: appointment.clientName,
          clientPhone: appointment.clientPhone,
          serviceName: service?.name || 'Serviço',
          professionalName: professional?.name || 'Profissional',
          dateTime: (appointment.dateTime as FirebaseFirestore.Timestamp).toDate(),
          price: appointment.price,
          tenantName: tenant?.name || 'Estabelecimento'
        });

        await appointmentsCollection.doc(appointmentDoc.id).update({
          reminderSent: true,
          reminderSentAt: FieldValue.serverTimestamp()
        });
      } catch (notifyError) {
        console.error('[WhatsApp] Erro ao enviar lembrete:', notifyError);
      }
    }
  } catch (error) {
    console.error('[Cron] Erro ao enviar lembretes:', error);
  }
}

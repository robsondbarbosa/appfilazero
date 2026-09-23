import { db as adminDb } from '@filazero/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { notificationService } from '../services/notification.service';

const appointmentsCollection = adminDb.collection('appointments');
const tenantsCollection = adminDb.collection('tenants');
const birthdayDiscountsCollection = adminDb.collection('birthdayDiscounts');

type BirthDateValue = string | Date | { toDate?: () => Date };

function normalizeBirthDate(value: BirthDateValue): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    return new Date(value);
  }

  if (typeof value === 'object' && value !== null && typeof value.toDate === 'function') {
    return value.toDate();
  }

  return new Date();
}

export async function checkBirthdaysAndNotify(): Promise<void> {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Buscar todos os tenants ativos
    const tenantsSnapshot = await tenantsCollection
      .where('isActive', '==', true)
      .get();

    for (const tenantDoc of tenantsSnapshot.docs) {
      const tenant = tenantDoc.data();
      const tenantId = tenantDoc.id;

      // Buscar clientes que fizeram agendamentos neste tenant
      const appointmentsSnapshot = await appointmentsCollection
        .where('tenantId', '==', tenantId)
        .get();

      // Agrupar clientes únicos por email
      const uniqueClients = new Map<string, {
        name: string;
        phone: string;
        email: string;
        birthDate?: { toDate?: () => Date } | string | Date;
      }>();

      appointmentsSnapshot.docs.forEach(doc => {
        const appointment = doc.data();
        const clientKey = appointment.clientEmail;

        if (!uniqueClients.has(clientKey)) {
          uniqueClients.set(clientKey, {
            name: appointment.clientName,
            phone: appointment.clientPhone,
            email: appointment.clientEmail,
            birthDate: appointment.clientBirthDate
          });
        }
      });

      // Verificar aniversários
      for (const [email, client] of uniqueClients) {
        if (client.birthDate) {
          const birthDate = normalizeBirthDate(client.birthDate);
          const birthMonth = birthDate.getMonth() + 1;
          const birthDay = birthDate.getDate();

          if (birthMonth === todayMonth && birthDay === todayDay) {
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
              await birthdayDiscountsCollection.add({
                tenantId,
                clientEmail: email,
                clientName: client.name,
                code: discountCode,
                discount: 20,
                validUntil: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                used: false,
                createdAt: FieldValue.serverTimestamp()
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[Birthday] Erro ao verificar aniversários:', error);
  }
}

export function scheduleBirthdayCheck(): void {
  console.log('[Birthday] Agendamento configurado para 9h diariamente');
}

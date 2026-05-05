import { whatsappService } from './whatsapp.service';
import { adminDb } from '@filazero/firebase';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface AppointmentNotificationData {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  professionalName: string;
  dateTime: Date;
  price: number;
  tenantName: string;
  tenantAddress?: string;
  tenantPhone?: string;
}

interface BirthdayNotificationData {
  clientName: string;
  clientPhone: string;
  tenantName: string;
  discountCode?: string;
}

export class NotificationService {
  /**
   * Envia confirmação de agendamento via WhatsApp
   */
  async sendAppointmentConfirmation(data: AppointmentNotificationData): Promise<boolean> {
    const message = this.buildAppointmentMessage(data);
    
    const result = await whatsappService.sendTextMessage({
      phoneNumber: data.clientPhone,
      message
    });

    // Registrar envio no Firestore
    await this.logNotification({
      type: 'APPOINTMENT_CONFIRMATION',
      phoneNumber: data.clientPhone,
      status: result ? 'SENT' : 'FAILED',
      data
    });

    return result;
  }

  /**
   * Envia lembrete de agendamento (24h antes)
   */
  async sendAppointmentReminder(data: AppointmentNotificationData): Promise<boolean> {
    const message = this.buildReminderMessage(data);
    
    const result = await whatsappService.sendTextMessage({
      phoneNumber: data.clientPhone,
      message
    });

    await this.logNotification({
      type: 'APPOINTMENT_REMINDER',
      phoneNumber: data.clientPhone,
      status: result ? 'SENT' : 'FAILED',
      data
    });

    return result;
  }

  /**
   * Envia mensagem de parabéns de aniversário
   */
  async sendBirthdayMessage(data: BirthdayNotificationData): Promise<boolean> {
    const message = this.buildBirthdayMessage(data);
    
    const result = await whatsappService.sendTextMessage({
      phoneNumber: data.clientPhone,
      message
    });

    await this.logNotification({
      type: 'BIRTHDAY',
      phoneNumber: data.clientPhone,
      status: result ? 'SENT' : 'FAILED',
      data
    });

    return result;
  }

  /**
   * Envia notificação de cancelamento
   */
  async sendCancellationNotification(
    data: AppointmentNotificationData,
    reason?: string
  ): Promise<boolean> {
    const message = this.buildCancellationMessage(data, reason);
    
    const result = await whatsappService.sendTextMessage({
      phoneNumber: data.clientPhone,
      message
    });

    await this.logNotification({
      type: 'APPOINTMENT_CANCELLATION',
      phoneNumber: data.clientPhone,
      status: result ? 'SENT' : 'FAILED',
      data
    });

    return result;
  }

  /**
   * Constrói mensagem de confirmação de agendamento
   */
  private buildAppointmentMessage(data: AppointmentNotificationData): string {
    const { 
      clientName, 
      serviceName, 
      professionalName, 
      dateTime, 
      price,
      tenantName,
      tenantAddress,
      tenantPhone 
    } = data;

    let message = `✅ *Agendamento Confirmado!*\n\n`;
    message += `Olá ${clientName.split(' ')[0]}! 👋\n\n`;
    message += `Seu agendamento em *${tenantName}* foi confirmado:\n\n`;
    message += `📋 *Serviço:* ${serviceName}\n`;
    message += `💇‍♂️ *Profissional:* ${professionalName}\n`;
    message += `📅 *Data:* ${formatDateTime(dateTime)}\n`;
    message += `💰 *Valor:* ${formatCurrency(price)}\n`;
    
    if (tenantAddress) {
      message += `📍 *Endereço:* ${tenantAddress}\n`;
    }
    
    message += `\n⏰ *Chegue 10 minutos antes do horário.*\n\n`;
    
    if (tenantPhone) {
      message += `📞 Dúvidas? Fale conosco: ${tenantPhone}\n\n`;
    }
    
    message += `Agradecemos a preferência! 💛`;

    return message;
  }

  /**
   * Constrói mensagem de lembrete
   */
  private buildReminderMessage(data: AppointmentNotificationData): string {
    const { 
      clientName, 
      serviceName, 
      professionalName, 
      dateTime,
      tenantName 
    } = data;

    let message = `⏰ *Lembrete de Agendamento*\n\n`;
    message += `Olá ${clientName.split(' ')[0]}!\n\n`;
    message += `Passando para lembrar do seu agendamento amanhã:\n\n`;
    message += `📋 *Serviço:* ${serviceName}\n`;
    message += `💇‍♂️ *Profissional:* ${professionalName}\n`;
    message += `📅 *Data:* ${formatDateTime(dateTime)}\n`;
    message += `🏢 *Local:* ${tenantName}\n\n`;
    message += `⏰ *Não se esqueça de chegar 10 minutos antes.*\n\n`;
    message += `Te esperamos! 💛`;

    return message;
  }

  /**
   * Constrói mensagem de parabéns de aniversário
   */
  private buildBirthdayMessage(data: BirthdayNotificationData): string {
    const { clientName, tenantName, discountCode } = data;

    let message = `🎉 *Feliz Aniversário!* 🎂\n\n`;
    message += `Olá ${clientName.split(' ')[0]}!\n\n`;
    message += `A equipe do *${tenantName}* deseja um dia incrível e cheio de alegria! 🥳\n\n`;
    message += `Que seu novo ano de vida seja repleto de conquistas, saúde e momentos especiais.\n\n`;
    
    if (discountCode) {
      message += `🎁 *Presente especial:*\n`;
      message += `Use o código *${discountCode}* e ganhe *20% OFF* no seu próximo agendamento!\n\n`;
      message += `Válido por 7 dias. Não perca! 😉\n\n`;
    }
    
    message += `Parabéns! 🎈🎊`;

    return message;
  }

  /**
   * Constrói mensagem de cancelamento
   */
  private buildCancellationMessage(
    data: AppointmentNotificationData, 
    reason?: string
  ): string {
    const { clientName, serviceName, dateTime, tenantName } = data;

    let message = `❌ *Agendamento Cancelado*\n\n`;
    message += `Olá ${clientName.split(' ')[0]},\n\n`;
    message += `Seu agendamento em *${tenantName}* foi cancelado:\n\n`;
    message += `📋 *Serviço:* ${serviceName}\n`;
    message += `📅 *Data:* ${formatDateTime(dateTime)}\n`;
    
    if (reason) {
      message += `📝 *Motivo:* ${reason}\n`;
    }
    
    message += `\nPara reagendar, acesse nosso site ou entre em contato.\n\n`;
    message += `Agradecemos a compreensão! 💛`;

    return message;
  }

  /**
   * Registra notificação no Firestore
   */
  private async logNotification(logData: {
    type: string;
    phoneNumber: string;
    status: string;
    data: any;
  }): Promise<void> {
    try {
      await adminDb.collection('notificationLogs').add({
        ...logData,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('[Notification] Erro ao registrar log:', error);
    }
  }
}

// Instância singleton
export const notificationService = new NotificationService();

import axios from 'axios';

interface WhatsAppConfig {
  apiUrl: string;
  apiKey: string;
  instanceName: string;
}

interface SendMessageParams {
  phoneNumber: string;
  message: string;
}

interface SendTemplateParams {
  phoneNumber: string;
  templateName: string;
  languageCode: string;
  components: any[];
}

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  /**
   * Envia mensagem de texto simples
   */
  async sendTextMessage({ phoneNumber, message }: SendMessageParams): Promise<boolean> {
    try {
      // Formatar número (remover caracteres não numéricos e adicionar código do país)
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      const response = await axios.post(
        `${this.config.apiUrl}/message/sendText/${this.config.instanceName}`,
        {
          number: formattedNumber,
          text: message,
          options: {
            delay: 1200,
            presence: 'composing'
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.apiKey
          }
        }
      );

      console.log(`[WhatsApp] Mensagem enviada para ${formattedNumber}:`, response.data);
      return true;
    } catch (error) {
      console.error('[WhatsApp] Erro ao enviar mensagem:', error);
      return false;
    }
  }

  /**
   * Envia mensagem com template (para WhatsApp Business API)
   */
  async sendTemplateMessage({ 
    phoneNumber, 
    templateName, 
    languageCode = 'pt_BR',
    components 
  }: SendTemplateParams): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      const response = await axios.post(
        `${this.config.apiUrl}/message/sendTemplate/${this.config.instanceName}`,
        {
          number: formattedNumber,
          template: templateName,
          language: languageCode,
          components
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.apiKey
          }
        }
      );

      console.log(`[WhatsApp] Template enviado para ${formattedNumber}:`, response.data);
      return true;
    } catch (error) {
      console.error('[WhatsApp] Erro ao enviar template:', error);
      return false;
    }
  }

  /**
   * Envia mensagem de mídia (imagem, documento, etc)
   */
  async sendMediaMessage(
    phoneNumber: string, 
    mediaUrl: string, 
    caption?: string,
    mediaType: 'image' | 'document' | 'video' | 'audio' = 'image'
  ): Promise<boolean> {
    try {
      const formattedNumber = this.formatPhoneNumber(phoneNumber);

      const endpointMap = {
        image: 'sendImage',
        document: 'sendDocument',
        video: 'sendVideo',
        audio: 'sendAudio'
      };

      const response = await axios.post(
        `${this.config.apiUrl}/message/${endpointMap[mediaType]}/${this.config.instanceName}`,
        {
          number: formattedNumber,
          [mediaType === 'document' ? 'document' : mediaType]: mediaUrl,
          caption: caption || undefined
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.config.apiKey
          }
        }
      );

      console.log(`[WhatsApp] Mídia enviada para ${formattedNumber}:`, response.data);
      return true;
    } catch (error) {
      console.error('[WhatsApp] Erro ao enviar mídia:', error);
      return false;
    }
  }

  /**
   * Formata número de telefone para padrão internacional
   */
  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    let cleaned = phone.replace(/\D/g, '');
    
    // Se não começar com código do país, adiciona 55 (Brasil)
    if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned;
    }
    
    return cleaned;
  }
}

// Instância singleton do serviço
export const whatsappService = new WhatsAppService({
  apiUrl: process.env.WHATSAPP_API_URL || 'http://localhost:8080',
  apiKey: process.env.WHATSAPP_API_KEY || '',
  instanceName: process.env.WHATSAPP_INSTANCE_NAME || 'filazero'
});

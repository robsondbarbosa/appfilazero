export enum UserRole {
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
  CLIENT = 'client',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  primaryColor: string;
  accentColor: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  whatsapp?: string;
  settings: {
    slotDuration: number;
    advanceBookingDays: number;
    cancellationPolicy: string;
    requireConfirmation: boolean;
    allowGuestBooking: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  bio?: string;
  avatar?: string;
  services: string[];
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      isAvailable: boolean;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  tenantId: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  dateTime: Date;
  duration: number;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
  paymentId?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  externalId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  tenantId: string;
  appointmentId: string;
  type: 'CONFIRMATION' | 'REMINDER' | 'CANCELLATION' | 'PAYMENT';
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  recipient: string;
  content: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: Date;
  errorMessage?: string;
  createdAt: Date;
}

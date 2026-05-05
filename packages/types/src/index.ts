// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  PROFESSIONAL = 'PROFESSIONAL',
  CLIENT = 'CLIENT'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD'
}

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

export enum TenantPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM'
}

// Interfaces
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  primaryColor: string;
  secondaryColor: string;
  bookingWindow: number;
  cancelDeadline: number;
  requirePayment: boolean;
  autoConfirm: boolean;
  mpAccessToken?: string;
  mpPublicKey?: string;
  plan: TenantPlan;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  tenantId?: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  duration: number; // minutos
  price: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional {
  id: string;
  tenantId: string;
  userId?: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  services: string[]; // IDs dos serviços
  workingHours: WorkingHours[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  breakStart?: string;
  breakEnd?: string;
  isAvailable: boolean;
}

export interface BlockedSlot {
  id: string;
  tenantId: string;
  professionalId?: string;
  startDateTime: Date;
  endDateTime: Date;
  reason?: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  dateTime: Date;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  appointmentId: string;
  tenantId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  mpPreferenceId?: string;
  mpPaymentId?: string;
  mpPixQrCode?: string;
  mpPixQrCodeBase64?: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

// DTOs
export interface CreateAppointmentDTO {
  tenantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  dateTime: string;
  notes?: string;
}

export interface CreateServiceDTO {
  tenantId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface CreateProfessionalDTO {
  tenantId: string;
  name: string;
  bio?: string;
  services: string[];
}

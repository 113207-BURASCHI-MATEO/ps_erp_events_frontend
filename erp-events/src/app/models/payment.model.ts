export type PaymentStatus = 'PAID' | 'PENDING_PAYMENT';

export interface Payment {
  idPayment: number;
  paymentDate: string;
  idClient: number;
  amount: number;
  detail?: string;
  status: PaymentStatus;
  reviewNote: string; // URL
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface PaymentPost {
  paymentDate: string; // ISO format: '2025-06-15T10:00:00'
  idClient: number;
  amount: number;
  detail?: string;
  status: PaymentStatus;
}

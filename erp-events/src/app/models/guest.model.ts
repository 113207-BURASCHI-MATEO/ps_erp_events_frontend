import { DocumentType } from './generic.model';

export type GuestType =
  | 'VIP'
  | 'REGULAR'
  | 'STAFF'
  | 'FAMILY'
  | 'FRIEND'
  | 'OTHER'
  | 'GENERAL';

export interface Guest {
  idGuest: number;
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  note?: string;
  documentType: DocumentType | string;
  documentNumber: string;
  birthDate: string;
}

export interface GuestPost {
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  note?: string;
  idEvent: number;
  documentType: DocumentType | string;
  documentNumber: string;
  birthDate: string;
}

export interface GuestPut {
  idGuest: number;
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  note?: string;
  idEvent: number;
  documentType: DocumentType | string;
  documentNumber: string;
  birthDate: string;
}

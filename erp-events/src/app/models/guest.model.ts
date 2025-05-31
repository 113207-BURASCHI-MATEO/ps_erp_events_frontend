import { DocumentType } from './generic.model';

export type GuestType =
  | 'VIP'
  | 'REGULAR'
  | 'STAFF'
  | 'FAMILY'
  | 'FRIEND'
  | 'OTHER'
  | 'GENERAL';

export type GuestAccessType = 'ENTRY' | 'EXIT';

export interface Guest {
  idGuest: number;
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  phoneNumber: string;
  note?: string;
  documentType: DocumentType | string;
  documentNumber: string;
  birthDate: string;
  acreditation: EventsGuests;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface GuestPost {
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  phoneNumber: string;
  note?: string;
  idEvent: number;
  documentType: DocumentType | string;
  documentNumber: string;
  birthDate: string;
  sector: string;
  seat: number;
  rowTable: string;
}

export interface GuestPut {
  idGuest: number;
  firstName: string;
  lastName: string;
  type: GuestType | string;
  email: string;
  phoneNumber: string;
  note?: string;
  idEvent: number;
  documentType: DocumentType | string;
  documentNumber: string;
  birthDate: string;
  sector: string;
  seat: number;
  rowTable: string;
}

export interface GuestAccess {
  idGuest: number;
  idEvent: number;
  accessType: GuestAccessType;
  actionDate: string; // formato ISO: '2025-05-29T14:30:00'
}

export interface EventsGuests {
  idRelation: number;            
  idEvent: number;              
  idGuest: number;               
  type: GuestType;               
  accessType: GuestAccessType;       
  actionDate: string;           
  isLate: boolean;              
  sector: string;               
  rowTable: string;             
  seat: number;  
  foodRestriction: boolean;
  foodDescription?: string;           
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

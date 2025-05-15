import { DocumentType } from './generic.model';

export interface User {
  idUser: number;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string, e.g., '2025-05-10'
  documentType: DocumentType | string;
  documentNumber: string;
  email: string;
  exp?: number; // TOKEN
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO format: 'YYYY-MM-DD'
  documentType: DocumentType | string;
  documentNumber: string;
  email: string;
  password: string;
}

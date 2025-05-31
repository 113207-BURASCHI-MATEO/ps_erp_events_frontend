import { DocumentType } from './generic.model';

export interface Role {
  idRole: number;
  roleCode: number;
  name: string;
  description: string;
}

export interface User {
  idUser: number;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string, e.g., '2025-05-10'
  documentType: DocumentType | string;
  documentNumber: string;
  email: string;
  role: Role;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
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

export interface UserUpdate {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string, e.g., '2025-05-10'
  documentNumber: string;
  password?: string;
  role: Role;
}

/* ##### ROLES ##### */

export const URLTargetType = {
  SUPERADMIN: 999,
  ADMIN: 100,
  SUPERVISOR: 200,
  EMPLOYEE: 300,
};

import { DocumentType } from "./generic.model";

export interface UserRegister {
    firstName: string;
    lastName: string;
    birthDate: string; // ISO format: 'YYYY-MM-DD'
    documentType: DocumentType | string;
    documentNumber: string;
    email: string;
    password: string;
  }
  
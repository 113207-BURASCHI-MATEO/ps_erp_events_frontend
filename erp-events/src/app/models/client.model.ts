import { DocumentType } from './generic.model';

export interface Client {
  idClient: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  documentType: DocumentType | string;
  documentNumber: string;
  aliasCbu: string;
  events: number[];
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface ClientPost {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  aliasCbu: string;
  documentType: DocumentType | string;
  documentNumber: string;
}

export interface ClientPut extends ClientPost {
  idClient: number;
}

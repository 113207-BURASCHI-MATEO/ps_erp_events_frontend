import { DocumentType } from "./generic.model";

export interface Employee {
  idEmployee: number;
  firstName: string;
  lastName: string;
  documentType: DocumentType | string;
  documentNumber: string;
  email: string;
  cuit: string;
  birthDate: string;
  aliasOrCbu: string;
  hireDate: string;
  position: string;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface EmployeePost {
  firstName: string;
  lastName: string;
  documentType: DocumentType | string;
  documentNumber: string;
  email: string;
  cuit: string;
  birthDate: string;
  aliasOrCbu: string;
  password: string;
  hireDate: string;
  position: string;
}

export interface EmployeePut {
  idEmployee: number;
  firstName: string;
  lastName: string;
  documentType: DocumentType | string;
  documentNumber: string;
  email: string;
  cuit: string;
  birthDate: string;
  aliasOrCbu: string;
  hireDate: string;
  position: string;
}

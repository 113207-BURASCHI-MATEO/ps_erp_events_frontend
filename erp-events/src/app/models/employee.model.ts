export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  documentType: 'DNI' | 'PASSPORT' | string;
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
  documentType: 'DNI' | 'PASSPORT' | string;
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
  id: number;
  firstName: string;
  lastName: string;
  documentType: 'DNI' | 'CUIT' | 'PASSPORT' | string;
  documentNumber: string;
  email: string;
  cuit: string;
  birthDate: string;
  aliasOrCbu: string;
  hireDate: string;
  position: string;
}

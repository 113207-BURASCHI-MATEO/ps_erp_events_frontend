export interface UserRegister {
    firstName: string;
    lastName: string;
    birthDate: string; // ISO format: 'YYYY-MM-DD'
    documentType: 'DNI' | 'CUIT' | 'PASSPORT' | string; // podés ajustar según el enum real
    documentNumber: string;
    email: string;
    password: string;
  }
  
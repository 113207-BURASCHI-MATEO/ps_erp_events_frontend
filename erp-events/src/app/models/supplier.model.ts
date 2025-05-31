export type SupplierType = 'CATERING' | 'DECORACION' | 'SOUND' | 'GASTRONOMIC' | 'FURNITURE' | 'ENTERTAINMENT';


export interface Supplier {
  idSupplier: number;
  name: string;
  cuit: string;
  email: string;
  phoneNumber: string;
  aliasCbu: string;
  supplierType: SupplierType | string;
  address: string;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface SupplierPost {
  name: string;
  cuit: string;
  email: string;
  phoneNumber: string;
  aliasCbu: string;
  supplierType: SupplierType | string;
  address: string;
}

export interface SupplierPut extends SupplierPost {
  idSupplier: number;
}
import { ContentType } from "./file.model";

export type AccountingConcept =
  | 'PAYMENT'
  | 'STAFF'
  | 'CLEANNING'
  | 'CATERING'
  | 'FEE'
  | 'SECURITY'
  | 'SPEAKERS'
  | 'EVENT_HALL'
  | 'SOUND_STAFF'
  | 'DECORATION'
  | 'DRINK_BAR'
  | 'OTHER';

export interface Concept {
  idConcept: number;
  idAccount: number;
  accountingDate: string;
  concept: AccountingConcept | string;
  comments: string;
  amount: number;
  idFile: number | null;
  fileContentType: ContentType;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
}

export interface ConceptPost {
  idAccount: number;
  accountingDate: string;
  concept: AccountingConcept | string;
  comments?: string;
  amount: number;
  idFile?: number | null;
  fileContentType: ContentType;
}

export interface ConceptPut {
  idConcept: number;
  idAccount: number;
  accountingDate: string;
  concept: AccountingConcept | string;
  comments?: string;
  amount: number;
  idFile?: number | null;
  fileContentType: ContentType;
}

export interface Account {
  idAccount: number;
  balance: number;
  creationDate: string;
  updateDate: string;
  softDelete: boolean;
  concepts: Concept[];
}

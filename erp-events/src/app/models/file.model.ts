import { HttpHeaders } from "@angular/common/http";

export type FileType = "RECEIPT" | "BILLING" | "PAYMENT" | "OTHER";
export type ContentType = "application/pdf" | "image/jpeg" | "image/png" | "image/jpg";

export interface File {
  idFile: number;
  fileType: FileType;
  fileName: string;
  fileContentType: ContentType;
  fileUrl: string;
  reviewNote?: string;
  softDelete: boolean;
  creationDate: string; // ISO 8601, e.g. '2024-05-30T14:00:00'
  updateDate: string;
  supplierId?: number;
  clientId?: number;
  employeeId?: number;
  paymentId?: number;
}

export interface FilePost {
  fileType: FileType;
  fileName: string;
  fileContentType: ContentType;
  fileUrl: string;
  reviewNote?: string;
  supplierId?: number;
  clientId?: number;
  employeeId?: number;
  paymentId?: number;
}

export interface FilePut {
  idFile: number;
  fileType?: FileType;
  fileName?: string;
  fileContentType?: ContentType;
  fileUrl?: string;
  reviewNote?: string;
  softDelete?: boolean;
  supplierId?: number;
  clientId?: number;
  employeeId?: number;
  paymentId?: number;
}

export interface BlobWithMetadata {
  body: Blob;
  headers: HttpHeaders;
}

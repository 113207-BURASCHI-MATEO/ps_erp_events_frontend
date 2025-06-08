import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { File as FileModel, FilePost, FilePut } from '../models/file.model';
import { map, Observable } from 'rxjs';
import {
  HttpClient,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.files}`
      : `${environment.apis.files}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FileModel[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as FileModel[]));
  }

  getAllBySupplier(supplierId: number): Observable<FileModel[]> {
    return this.http
      .get<any>(`${this.baseUrl}/supplier/${supplierId}`, { withCredentials: true })
      .pipe(map((response) => response.content as FileModel[]));
  }

  getAllByClient(clientId: number): Observable<FileModel[]> {
    return this.http
      .get<any>(`${this.baseUrl}/client/${clientId}`, { withCredentials: true })
      .pipe(map((response) => response.content as FileModel[]));
  }

  getAllByEmployee(employeeId: number): Observable<FileModel[]> {
    return this.http
      .get<any>(`${this.baseUrl}/employee/${employeeId}`, { withCredentials: true })
      .pipe(map((response) => response.content as FileModel[]));
  }

  getAllByPayment(paymentId: number): Observable<FileModel[]> {
    return this.http
      .get<any>(`${this.baseUrl}/payment/${paymentId}`, { withCredentials: true })
      .pipe(map((response) => response.content as FileModel[]));
  }

  getById(id: number): Observable<FileModel> {
    return this.http.get<FileModel>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getFileById(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/file/${id}`, {
      responseType: 'blob',
      withCredentials: true,
    }) as Observable<Blob>;
  }

  getBySupplier(supplierId: number, fileId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/supplier/${supplierId}/file/${fileId}`,
      {
        responseType: 'blob',
        withCredentials: true,
      }
    ) as Observable<Blob>;
  }

  getByClient(clientId: number, fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/client/${clientId}/file/${fileId}`, {
      responseType: 'blob',
      withCredentials: true,
    }) as Observable<Blob>;
  }

  getByEmployee(employeeId: number, fileId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/employee/${employeeId}/file/${fileId}`,
      {
        responseType: 'blob',
        withCredentials: true,
      }
    ) as Observable<Blob>;
  }

  getByPayment(paymentId: number, fileId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/payment/${paymentId}/file/${fileId}`,
      {
        responseType: 'blob',
        withCredentials: true,
      }
    ) as Observable<Blob>;
  }

  create(data: FilePost, file: File): Observable<FileModel> {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    formData.append('file', file as any);
    return this.http.post<FileModel>(this.baseUrl, formData, {
      withCredentials: true,
    });
  }

  update(id: number, data: FilePut, file: File): Observable<FileModel> {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    formData.append('file', file as any);
    return this.http.put<FileModel>(`${this.baseUrl}/${id}`, formData, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}

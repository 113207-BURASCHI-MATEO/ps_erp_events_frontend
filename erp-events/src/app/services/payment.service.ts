import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payment, PaymentPost } from '../models/payment.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.payments}`
      : `${environment.apis.payments}`
  }`;

  constructor(private http: HttpClient) {}

  /* getAll(page: number, size: number, isActive: boolean, sort: string, direction: string): Observable<Page<PaymentDTO>> {
      const params = new HttpParams()
        .set('page', page)
        .set('size', size)
        .set('isActive', isActive)
        .set('sort', sort)
        .set('sort_direction', direction);
      return this.http.get<Page<PaymentDTO>>(this.apiUrl, { params });
    } */

  getAll(): Observable<Payment[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as Payment[]));
  }

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(dto: PaymentPost): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, dto, {
      withCredentials: true,
    });
  }

  updateStatus(id: number, status: string): Observable<Payment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<Payment>(
      `${this.baseUrl}/${id}`,
      JSON.stringify(status),
      { headers, withCredentials: true }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Supplier, SupplierPost, SupplierPut } from '../models/supplier.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = 'http://localhost:8080/suppliers'; // adaptá al backend real

  constructor(private http: HttpClient) {}

  getAll(): Observable<Supplier[]> {
    return this.http.get<any>(this.baseUrl, { withCredentials: true }).pipe(
          map(response => response.content as Supplier[])
        );
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(supplier: SupplierPost): Observable<Supplier> {
    return this.http.post<Supplier>(this.baseUrl, supplier, { withCredentials: true });
  }

  update(id: number, supplier: SupplierPut): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/${id}`, supplier, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

}

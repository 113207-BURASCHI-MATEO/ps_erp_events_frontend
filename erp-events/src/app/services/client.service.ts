import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Client, ClientPost, ClientPut } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

 //private baseUrl = 'http://localhost:8080/clients';

 private baseUrl: string = `${environment.production 
     ? `${environment.apis.clients}` 
     : `${environment.apis.clients}`}`;
 
   constructor(private http: HttpClient) {}
 
   getAll(): Observable<Client[]> {
     return this.http.get<any>(this.baseUrl, { withCredentials: true }).pipe(
       map(response => response.content as Client[])
     );
   }
 
   create(employee: ClientPost): Observable<Client> {
     return this.http.post<Client>(this.baseUrl, employee, { withCredentials: true });
   }
 
   getById(id: number): Observable<Client> {
     return this.http.get<Client>(`${this.baseUrl}/${id}`, { withCredentials: true });
   }
   
   update(id: number, data: ClientPut): Observable<Client> {
     return this.http.put<Client>(`${this.baseUrl}/${id}`, data, { withCredentials: true });
   }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
   }

   getByDocument(documentType: string, documentNumber: string): Observable<Client> {
    const params = new HttpParams()
      .set('documentType', documentType)
      .set('documentNumber', documentNumber);
  
    return this.http.get<Client>(`${this.baseUrl}/exists`, { params });
  }
  
}

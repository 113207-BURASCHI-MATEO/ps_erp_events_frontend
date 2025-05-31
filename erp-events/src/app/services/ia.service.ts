import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IaService {
  private baseUrl: string = `${
    environment.production ? `${environment.apis.ia}` : `${environment.apis.ia}`
  }`;

  constructor(private http: HttpClient) {}

  analyzdeDashboard(request: string): Observable<string> {
    const url = `${this.baseUrl}/dashboards`;
    return this.http.post<string>(url, request, {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text' as 'json',
      withCredentials: true
    });
  }
  
}

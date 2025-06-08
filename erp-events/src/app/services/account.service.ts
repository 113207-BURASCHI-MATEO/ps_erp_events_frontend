import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.accounts}`
      : `${environment.apis.accounts}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Account[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as Account[]));
  }

  getById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(account: Account): Observable<Account> {
    return this.http.post<Account>(this.baseUrl, account, {
      withCredentials: true,
    });
  }

  update(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${id}`, account, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getByEventId(idEvent: number): Observable<Account> {
    return this.http.get<any>(`${this.baseUrl}/event/${idEvent}`, {
      withCredentials: true,
    });
  }
}

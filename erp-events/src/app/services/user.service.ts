import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User, UserRegister, UserUpdate } from '../models/user.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.users}`
      : `${environment.apis.users}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as User[]));
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(supplier: UserRegister): Observable<User> {
    return this.http.post<User>(this.baseUrl, supplier, {
      withCredentials: true,
    });
  }

  update(id: number, supplier: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, supplier, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}

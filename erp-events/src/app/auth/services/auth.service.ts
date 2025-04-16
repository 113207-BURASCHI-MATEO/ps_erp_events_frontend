import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegister } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth'; // Cambiá según tu backend

  constructor(private http: HttpClient) {}
  /* 
  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    //return this.http.post(`${this.baseUrl}/login`, data);
    return this.http.post(`${this.baseUrl}/login`, data, { withCredentials: true });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  } */

    login(data: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.baseUrl}/login`, data, { withCredentials: true });
    }
  
    register(user: UserRegister): Observable<any> {
      return this.http.post(`${this.baseUrl}/register`, user, { withCredentials: true });
    }
  
    logout() {
      // Si el backend maneja logout con cookie, podría llamarse a un endpoint /logout
      // return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('token'); // opcional si usás algo local
    }
  
    isLoggedIn(): boolean {
      // Si usás cookies puras, necesitás validar vía backend (idealmente con un /me o similar)
      return true; // modificar esto según tu lógica real
    }
}

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { User, UserRegister } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { log } from 'console';
import e from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadUserFromToken()
  );
  currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isLoggedIn()
  );
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Carga el usuario solo si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserFromToken();
    }
  }


  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post(`${this.baseUrl}/login`, credentials, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          const authHeader = response.headers.get('Authorization');

          if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded: any = jwtDecode(token);

            const isValidToken =
              decoded.iss === 'erp_events' &&
              decoded.exp > Date.now() / 1000 &&
              decoded.userId === credentials.email;

            if (isValidToken) {
              localStorage.setItem('token', token);
              this.isAuthenticatedSubject.next(true);
              this.currentUserSubject.next(response.body as User);
              console.log('USUARIO AUTENTICADO:', response.body);
            } else {
              this.isAuthenticatedSubject.next(false);
              console.error('Token inválido o expirado');
              throw new Error('Token inválido o expirado');
            }
          } else {
            throw new Error('No se recibió token en la cabecera Authorization');
          }
        }),
        map((response) => response.body as User),
        catchError((err) => {
          this.isAuthenticatedSubject.next(false);
          console.error('Error durante el proceso de login:', err);
          return throwError(() => err);
        })
      );
  }

  register(data: UserRegister): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/register`, data, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('No se puede acceder a las cookies.');
      return false;
    }
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (e) {
      return false;
    }
  }

  private getTokenFromCookies(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('No se puede acceder a las cookies.');

      return null;
    }

    const name = 'jwt-token=';
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }
    return null;
  }

  private loadUserFromToken(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const token = this.getTokenFromCookies();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        idUser: decoded.idUser,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        birthDate: decoded.birthDate,
        documentType: decoded.documentType,
        documentNumber: decoded.documentNumber,
        email: decoded.email,
        exp: decoded.exp,
      };
    } catch (e) {
      return null;
    }
  }
}

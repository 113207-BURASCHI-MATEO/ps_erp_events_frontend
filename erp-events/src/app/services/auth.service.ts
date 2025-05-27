import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { User, UserRegister } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.auth}`
      : `${environment.apis.auth}`
  }`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
          this.currentUserSubject.next(null);
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

  recoverPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>(`${this.baseUrl}/recover-password`, null, { params });
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, data);
  }

  changePassword(data: { newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/change-password`, data, {
      withCredentials: true
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  hasRoleCodes(targetRoleCodes: number[] | undefined): boolean {
    if (!targetRoleCodes || targetRoleCodes.length === 0) return true;
    const user: User | null = this.currentUserSubject.getValue();
    if (!user || !user.role || user.role.roleCode === undefined) return false;
    return targetRoleCodes.includes(user.role.roleCode);
  }
}

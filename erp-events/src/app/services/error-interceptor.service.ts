import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{

  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let readableMessage = 'Ocurrió un error inesperado.';

        if (error.status === 0) {
          readableMessage = 'No se puede conectar con el servidor.';
        } else if (error.status >= 500) {
          readableMessage = 'Error del servidor. Intenta más tarde.';
        } else if (error.status === 429) {
          readableMessage = 'Límite de uso alcanzado. Intenta más tarde o revisa tu cuota.';
        } else if (error.status >= 400) {
          readableMessage =
            error.error?.message ||
            error.error?.error?.message ||
            'Error en la solicitud.';
        }

        (error as any).readableMessage = readableMessage;

        console.error('❌ Error HTTP interceptado:', error);

        return throwError(() => error);
      })
    );
  }
}

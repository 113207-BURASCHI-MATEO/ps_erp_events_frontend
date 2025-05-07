import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { ClientService } from '../services/client.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

export const docValidator = (
  clientService: ClientService
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.parent) {
      return of(null);
    }

    const docNumber = control.parent.get('documentNumber')?.value;
    const docType = control.parent.get('documentType')?.value;

    if (!docNumber || !docType) {
      return of(null);
    }

    return timer(1000).pipe(
      switchMap(() =>
        clientService.getByDocument(docNumber, docType).pipe(
          map(() => {
            return { clientExists: true };
          }),
          catchError((error) => {
            if (error.status === 404) {
              return of(null);
            }
            return of({ serverError: true });
          })
        )
      )
    );
  };
};

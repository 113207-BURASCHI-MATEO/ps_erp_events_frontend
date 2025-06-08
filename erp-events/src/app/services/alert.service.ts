import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor() {}

  delete(entity: string): Promise<boolean> {
    return Swal.fire({
      title: `¿Está seguro de eliminar ${entity}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      imageAlt: 'Advertencia',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      }
    }).then((result) => result.isConfirmed);
  }

  showSuccessToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal-success-toast'
      }
    });
  }

  showErrorToast(message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal-error-toast'
      }
    });
  }

  selectOption<T>(
    title: string,
    label: string,
    options: { value: T; label: string }[]
  ): Promise<T | null> {
    const selectId = 'swal-mat-select';

    const html = `
      <div class="mb-3 text-start">
    <label for="${selectId}" class="form-label fw-semibold">
      ${label}
    </label>
    <select id="${selectId}" class="form-select">
      ${options
        .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
        .join('')}
    </select>
  </div>
    `;

    return Swal.fire({
      title,
      html,
      //icon: 'info',
      imageUrl: 'assets/pet_7.png',
      imageWidth: 100,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      customClass: {
        popup: 'mat-elevation-z4',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
      preConfirm: () => {
        const select = document.getElementById(selectId) as HTMLSelectElement;
        return select ? (select.value as unknown as T) : null;
      },
    }).then((result) => (result.isConfirmed ? result.value : null));
  }
}

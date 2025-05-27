import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss'
})
export class RecoveryPasswordComponent {
  form: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.alertService.showErrorToast('Ingrese un correo electrónico válido.');
      return;
    }

    const email = this.form.value.email;

    this.authService.recoverPassword(email).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Correo de recuperación enviado. Revise su bandeja de entrada.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al recuperar contraseña', err);
        this.alertService.showErrorToast(`Error: ${err.error?.message || 'No se pudo procesar la solicitud.'}`);
      }
    });
  }
}

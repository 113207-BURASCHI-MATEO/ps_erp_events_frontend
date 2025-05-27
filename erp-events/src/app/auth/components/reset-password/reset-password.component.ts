import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { log } from 'console';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  form: FormGroup;
  token: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.form = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.alertService.showErrorToast('Ingrese una contraseña válida.');
      return;
    }

    if (!this.token) {
      this.alertService.showErrorToast('Token de recuperación no encontrado.');
    }

    const newPassword = this.form.value.password;

    this.authService.resetPassword({
      token: this.token,
      newPassword
    }).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Contraseña actualizada correctamente. Ahora puede iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error: ${err.error?.message || 'No se pudo restablecer la contraseña.'}`);
      }
    });
  }
}

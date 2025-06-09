import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Inicio de sesión exitoso.');
          this.router.navigate(['/landing']);
        },
        error: (err) => {
          console.error('Error al iniciar sesión', err);
          this.alertService.showErrorToast(`Error al iniciar sesión`);
        }
      });
    } else {
      this.alertService.showErrorToast('Por favor, complete los campos correctamente.');
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToRecover(): void {
    this.router.navigate(['/recover-password']);
  }
  
}

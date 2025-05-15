import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserRegister } from '../../../models/user.model';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,  
    MatOptionModule,
    MatButtonModule,
    MatCardModule
    
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*\\d).{8,}$')
      ]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const user: UserRegister = this.form.value;
      this.authService.register(user).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Registro exitoso.');
          this.router.navigate(['/landing']);
        },
        error: (err) => {
          console.error('Error en el registro', err);
          this.alertService.showErrorToast(`Error: ${err.error.message}`);
        }
      });
    } else {
      this.alertService.showErrorToast('Por favor, complete todos los campos correctamente.');
    }
  }
}

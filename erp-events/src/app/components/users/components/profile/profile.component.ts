import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { User, UserUpdate } from '../../../../models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    FormFieldErrorComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  isDisabled: boolean = true;
  user: User = null!;
  passwordForm: FormGroup;
  showPasswordForm: boolean = false;
  hidePassword: boolean = true;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private userService = inject(UserService);

  constructor() {
    this.form = this.fb.group({
      firstName: new FormControl(
        { value: '', disabled: this.isDisabled },
        [Validators.required, Validators.minLength(2)]
      ),
      lastName: new FormControl(
        { value: '', disabled: this.isDisabled },
        [Validators.required, Validators.minLength(2)]
      ),
      documentType: new FormControl(
        { value: '', disabled: this.isDisabled },
        [Validators.required]
      ),
      documentNumber: new FormControl(
        { value: '', disabled: this.isDisabled },
        [Validators.required, Validators.pattern(/^\d+$/)]
      ),
      email: new FormControl(
        { value: '', disabled: this.isDisabled },
        [Validators.required, Validators.email]
      ),
      birthDate: new FormControl(
        { value: '', disabled: this.isDisabled },
        [Validators.required]
      ),
      role: new FormControl(
        { value: '', disabled: true } 
      ),
      password: new FormControl({value: '', disabled: this.isDisabled}, [
        //Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/)
      ])
    });
    this.passwordForm = this.fb.group({
      newPassword: new FormControl('', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/)
      ])
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            documentType: user.documentType,
            documentNumber: user.documentNumber,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role?.name ?? 'Sin rol'
          });
        } 
      },
      error: () => {
        this.alertService.showErrorToast('Error al cargar los datos del perfil');
      }
    });
  }

  enableForm(): void {
    this.isDisabled = false;
    Object.keys(this.form.controls).forEach(key => {
      if (key !== 'role') {
        this.form.get(key)?.enable();
      }
    });
  }

  saveChanges(): void {
    if (this.form.invalid || !this.user?.idUser) {
      this.alertService.showErrorToast('No se pudo identificar el usuario o el formulario no es válido');
      return;
    }
  
    const formValue = this.form.getRawValue();
  
    const updateData: UserUpdate = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthDate: formValue.birthDate,
      documentNumber: formValue.documentNumber,
      password: formValue.password || undefined,
      role: this.user.role
    };
  
    this.userService.update(this.user.idUser, updateData).subscribe({
      next: (updatedUser) => {
        this.alertService.showSuccessToast('Perfil actualizado correctamente');
  
        this.isDisabled = true;
        Object.keys(this.form.controls).forEach(key => {
          if (key !== 'role') {
            this.form.get(key)?.disable();
          }
        });
      },
      error: (err) => {
        this.alertService.showErrorToast('Error al actualizar el perfil');
        console.error(err);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
  
    const newPassword = this.passwordForm.value.newPassword;
  
    this.authService.changePassword({ newPassword }).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Contraseña actualizada correctamente');
        this.passwordForm.reset();
        this.showPasswordForm = false;
        this.hidePassword = true;
      },
      error: (err) => {
        this.alertService.showErrorToast('Error al cambiar la contraseña');
        console.error(err);
      }
    });
  }
  
  

  
  
  
}

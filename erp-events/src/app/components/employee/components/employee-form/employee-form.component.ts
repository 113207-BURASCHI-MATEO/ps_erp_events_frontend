import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from '../../../../services/employee.service';
import {
  Employee,
  EmployeePost,
  EmployeePut,
} from '../../../../models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { cuitValidator } from '../../../../validators/cuit.validator';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormFieldErrorComponent
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  form: FormGroup;
  employeeId: number | null = null;
  hidePassword = true;

  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  constructor(
  ) {
    this.form = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d){10,})\+?[0-9\s-]+$/)]),
      cuit: new FormControl('', [Validators.required, Validators.pattern('^(20|23|24|27|30|33|34)[0-9]{9}$'), cuitValidator()]),
      birthDate: new FormControl('', [Validators.required]),
      aliasCbu: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*\\d).{8,}$')]),
      hireDate: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.employeeId = +idParam;
        this.loadEmployee(this.employeeId);
        this.form.get('password')?.disable();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const dataBase = {
      ...formValue,
      birthDate: formValue.birthDate,
      hireDate: formValue.hireDate,
    };

    if (this.employeeId) {
      const { password, ...dataWithoutPass } = dataBase;
      const dataPut: EmployeePut = { id: this.employeeId, ...dataWithoutPass };
      this.service.update(this.employeeId, dataPut).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Empleado actualizado correctamente.');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al actualizar empleado: ${err.error.readableMessage}`);
        },
      });
    } else {
      const dataPost: EmployeePost = dataBase;
      this.service.create(dataPost).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Empleado creado correctamente.');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al crear empleado: ${err.error.readableMessage}`);
        },
      });
    }
  }

  loadEmployee(id: number): void {
    this.service.getById(id).subscribe({
      next: (emp: Employee) => {
        this.form.patchValue({
          ...emp,
          birthDate: emp.birthDate,
          hireDate: emp.hireDate,
          password: '', // vacía por seguridad
        });
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar empleado: ${err.error.readableMessage}`);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
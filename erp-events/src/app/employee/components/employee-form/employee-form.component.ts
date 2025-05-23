import { Component } from '@angular/core';
import {
  FormBuilder,
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
import { EmployeeService } from '../../../services/employee.service';
import {
  Employee,
  EmployeePost,
  EmployeePut,
} from '../../../models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

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
    MatNativeDateModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent {
  form: FormGroup;
  employeeId: number | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private service: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cuit: ['', Validators.required],
      birthDate: ['', Validators.required],
      aliasOrCbu: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      hireDate: ['', Validators.required],
      position: ['', Validators.required],
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
          this.alertService.showErrorToast(`Error al actualizar empleado: ${err.error.message}`);
          console.error('Error al actualizar empleado:', err.error.message);
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
          this.alertService.showErrorToast(`Error al crear empleado: ${err.error.message}`);
          console.error('Error al crear empleado:', err.error.message);
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
        this.alertService.showErrorToast(`Error al cargar empleado: ${err.error.message}`);
        console.error('Error al cargar empleado', err.error.message);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
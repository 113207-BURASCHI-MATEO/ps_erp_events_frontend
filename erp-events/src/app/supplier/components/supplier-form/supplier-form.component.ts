import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SupplierService } from '../../../services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, SupplierPost, SupplierPut, SupplierType } from '../../../models/supplier.model';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent {

  form: FormGroup;
  supplierId: number | null = null;
  supplierTypes: SupplierType[] = ['CATERING', 'DECORACION', 'SOUND', 'GASTRONOMIC', 'FURNITURE', 'ENTERTAINMENT'];


  constructor(
    private fb: FormBuilder,
    private service: SupplierService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cuit: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
      ],
      aliasCbu: ['', Validators.required],
      supplierType: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.supplierId = +idParam;
        this.loadSupplier(this.supplierId);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.supplierId) {
      const dataPut: SupplierPut = {
        idSupplier: this.supplierId,
        ...formValue
      };
      this.service.update(this.supplierId, dataPut).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Proveedor actualizado correctamente.');
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al actualizar proveedor: ${err.error.message}`);
          console.error('Error al actualizar proveedor:', err.error.message);
        },
      });
    } else {
      const dataPost: SupplierPost = formValue;
      this.service.create(dataPost).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Proveedor creado correctamente.');
          this.router.navigate(['/suppliers']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al crear proveedor: ${err.error.message}`);
          console.error('Error al crear proveedor:', err.error.message);
        },
      });
    }
  }

  loadSupplier(id: number): void {
    this.service.getById(id).subscribe({
      next: (sup: Supplier) => {
        this.form.patchValue(sup); // {...sup}
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar proveedor: ${err.error.message}`);
        console.error('Error al cargar proveedor:', err.error.message);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }
}

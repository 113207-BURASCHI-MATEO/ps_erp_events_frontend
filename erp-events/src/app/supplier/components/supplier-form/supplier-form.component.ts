import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SupplierService } from '../../../services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, SupplierPost, SupplierPut } from '../../../models/supplier.model';

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
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.css'
})
export class SupplierFormComponent {

  form: FormGroup;
  supplierId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: SupplierService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cuit: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
      ],
      aliasOrCbu: ['', Validators.required],
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
        next: () => this.router.navigate(['/suppliers']),
        error: (err) => {
          alert('Error al actualizar proveedor: ' + err.message);
          console.error('Error al actualizar proveedor:', err);
        },
      });
    } else {
      const dataPost: SupplierPost = formValue;
      this.service.create(dataPost).subscribe({
        next: () => this.router.navigate(['/suppliers']),
        error: (err) => {
          alert('Error al crear proveedor: ' + err.message);
          console.error('Error al crear proveedor:', err);
        },
      });
    }
  }

  loadSupplier(id: number): void {
    this.service.getById(id).subscribe({
      next: (sup: Supplier) => {
        this.form.patchValue(sup);
      },
      error: (err) => console.error('Error al cargar proveedor', err),
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }
}

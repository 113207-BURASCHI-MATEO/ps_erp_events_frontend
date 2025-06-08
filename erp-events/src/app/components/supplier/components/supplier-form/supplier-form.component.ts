import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SupplierService } from '../../../../services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier, SupplierPost, SupplierPut, SupplierType } from '../../../../models/supplier.model';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../../services/alert.service';
import { cuitValidator } from '../../../../validators/cuit.validator';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

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
    MatIconModule,
    FormFieldErrorComponent
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent {

  form: FormGroup;
  supplierId: number | null = null;
  supplierTypes: SupplierType[] = ['CATERING', 'DECORATION', 'SOUND', 'GASTRONOMIC', 'FURNITURE', 'ENTERTAINMENT'];


  private fb = inject(FormBuilder);
  private service = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  constructor(
  ) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      cuit: new FormControl('', [ Validators.required, Validators.pattern('^(20|23|24|27|30|33|34)[0-9]{9}$'), cuitValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d){10,})\+?[0-9\s-]+$/)]),
      aliasCbu: new FormControl('', [Validators.required]),
      supplierType: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
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
          this.alertService.showErrorToast(`Error al actualizar proveedor: ${err.error.readableMessage}`);
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
          this.alertService.showErrorToast(`Error al crear proveedor: ${err.error.readableMessage}`);
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
        this.alertService.showErrorToast(`Error al cargar proveedor: ${err.error.readableMessage}`);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }
}

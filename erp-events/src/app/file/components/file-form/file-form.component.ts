import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { FileService } from '../../../services/file.service';
import {
  File as FileModel,
  FilePost,
  FilePut,
} from '../../../models/file.model';
import { ClientService } from '../../../services/client.service';
import { SupplierService } from '../../../services/supplier.service';
import { EmployeeService } from '../../../services/employee.service';
import { Client } from '../../../models/client.model';
import { Supplier } from '../../../models/supplier.model';
import { Employee } from '../../../models/employee.model';
import { MatRadioModule } from '@angular/material/radio';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-form',
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
    MatRadioModule,
  ],
  templateUrl: './file-form.component.html',
  styleUrl: './file-form.component.scss',
})
export class FileFormComponent {
  form: FormGroup;
  fileId: number | null = null;
  clients: Client[] = [];
  suppliers: Supplier[] = [];
  employees: Employee[] = [];
  file: File | null = null;

  previewUrl: SafeResourceUrl | null = null;

  entityTypes = [
    { value: 'CLIENT', label: 'Cliente' },
    { value: 'SUPPLIER', label: 'Proveedor' },
    { value: 'EMPLOYEE', label: 'Empleado' },
  ];

  private fb = inject(FormBuilder);
  private fileService = inject(FileService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private supplierService = inject(SupplierService);
  private employeeService = inject(EmployeeService);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.form = this.fb.group({
      fileType: new FormControl('', [Validators.required]),
      fileName: new FormControl('', [Validators.required]),
      fileContentType: new FormControl('', [Validators.required]),
      reviewNote: new FormControl(''),
      supplierId: new FormControl(''),
      clientId: new FormControl(''),
      employeeId: new FormControl(''),
      file: new FormControl(null, Validators.required),
      targetType: new FormControl('CLIENT', Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fileId = +id;
        this.loadFile(this.fileId);
      }
    });
    this.loadClients();
    this.loadSuppliers();
    this.loadEmployees();
  }

  get targetType(): string {
    return this.form.get('targetType')?.value;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.file) {
      if (this.fileId) {
        const dataPut: FilePut = {
          idFile: this.fileId,
          fileType: formValue.fileType,
          fileName: formValue.fileName,
          fileContentType: formValue.fileContentType,
          reviewNote: formValue.reviewNote,
          supplierId:
            formValue.targetType === 'SUPPLIER'
              ? formValue.supplierId
              : undefined,
          clientId:
            formValue.targetType === 'CLIENT' ? formValue.clientId : undefined,
          employeeId:
            formValue.targetType === 'EMPLOYEE'
              ? formValue.employeeId
              : undefined,
          softDelete: false,
        };

        this.fileService.update(this.fileId, dataPut, this.file).subscribe({
          next: () => {
            this.alertService.showSuccessToast(
              'Archivo actualizado correctamente.'
            );
            this.router.navigate(['/files']);
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al actualizar archivo: ${
                err.error?.message || err.message
              }`
            );
            console.error('Error al actualizar archivo:', err);
          },
        });
      } else {
        const dataPost: FilePost = {
          fileType: formValue.fileType,
          fileName: formValue.fileName,
          fileContentType: formValue.fileContentType,
          reviewNote: formValue.reviewNote,
          supplierId:
            formValue.targetType === 'SUPPLIER'
              ? formValue.supplierId
              : undefined,
          clientId:
            formValue.targetType === 'CLIENT' ? formValue.clientId : undefined,
          employeeId:
            formValue.targetType === 'EMPLOYEE'
              ? formValue.employeeId
              : undefined,
          fileUrl: '', // This will be set by the backend
        };

        this.fileService.create(dataPost, this.file).subscribe({
          next: () => {
            this.alertService.showSuccessToast('Archivo subido correctamente.');
            this.router.navigate(['/files']);
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al subir archivo: ${err.error?.message || err.message}`
            );
            console.error('Error al subir archivo:', err);
          },
        });
      }
    }
  }

  loadFile(id: number): void {
    this.fileService.getById(id).subscribe({
      next: (file: FileModel) => {
        this.form.patchValue({
          ...file,
          creationDate: file.creationDate,
          updateDate: file.updateDate,
        });
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar archivo: ${err.error.readableMessage}`
        );
      },
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.file = file;
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      const url = URL.createObjectURL(file);
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }  else {
      this.previewUrl = null;
    }
  
  }

  goBack(): void {
    this.router.navigate(['/files']);
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (res) => (this.clients = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar clientes: ${err.error.readableMessage}`
        );
      },
    });
  }

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe({
      next: (res) => (this.suppliers = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar proveedores: ${err.error.readableMessage}`
        );
      },
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (res) => (this.employees = res),
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar empleados: ${err.error.readableMessage}`
        );
      },
    });
  }
}

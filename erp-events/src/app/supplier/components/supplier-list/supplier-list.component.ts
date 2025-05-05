import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SupplierViewDialogComponent } from '../supplier-view-dialog/supplier-view-dialog.component';
import { SupplierService } from '../../../services/supplier.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from '../../../services/export.service';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    SupplierViewDialogComponent
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent {

  suppliers: Supplier[] = [];
  allSuppliers: Supplier[] = [];
  displayedColumns = [
    'idSupplier',
    'name',
    'cuit',
    'email',
    'phoneNumber',
    'supplierType',
    'actions'
  ];
  searchValue: string = '';

  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private dialog: MatDialog,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.allSuppliers = data;
      },
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  onSearch(): void {
    const value = this.searchValue.trim().toLowerCase();

    if (!value) {
      this.suppliers = this.allSuppliers;
      return;
    }

    this.suppliers = this.allSuppliers.filter(sup =>
      sup.name.toLowerCase().includes(value) ||
      sup.cuit.toLowerCase().includes(value) ||
      sup.email.toLowerCase().includes(value)
    );
  }

  goToCreate(): void {
    this.router.navigate(['/suppliers/create']);
  }

  viewSupplier(id: number): void {
    const supplier = this.suppliers.find(s => s.idSupplier === id);
    if (!supplier) return;

    this.dialog.open(SupplierViewDialogComponent, {
      data: supplier,
      width: '600px',
      maxWidth: '95vw'
    });
  }

  editSupplier(id: number): void {
    this.router.navigate(['/suppliers/edit', id]);
  }

  deleteSupplier(id: number): void {
    const confirmDelete = confirm('¿Estás seguro que deseas eliminar este proveedor?');

    if (confirmDelete) {
      this.supplierService.delete(id).subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter(s => s.idSupplier !== id);
        },
        error: (err) => console.error('Error al eliminar proveedor', err),
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.suppliers,
      'Proveedores',
      [['Nombre', 'CUIT', 'Email', 'Teléfono', 'Tipo']],
      sup => [
        sup.name,
        sup.cuit,
        sup.email,
        sup.phoneNumber,
        sup.supplierType
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.suppliers,
      'Proveedores',
      sup => ({
        Nombre: sup.name,
        CUIT: sup.cuit,
        Email: sup.email,
        Teléfono: sup.phoneNumber,
        Tipo: sup.supplierType
      })
    );
  }
}

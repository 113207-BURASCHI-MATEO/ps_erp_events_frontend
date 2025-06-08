import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SupplierService } from '../../../../services/supplier.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from '../../../../services/export.service';
import { Supplier } from '../../../../models/supplier.model';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { AgGridAngular } from '@ag-grid-community/angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  ModuleRegistry,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../../services/alert.service';
import { renderIconField } from '../../../../utils/render-icon';

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
    ViewDialogComponent,
    OptionsComponent,
    AgGridAngular,
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss',
})
export class SupplierListComponent {
  isBrowser: boolean;

  suppliers: Supplier[] = [];
  allSuppliers: Supplier[] = [];
  displayedColumns = [
    'idSupplier',
    'name',
    'cuit',
    'email',
    'phoneNumber',
    'supplierType',
    'actions',
  ];
  gridApi!: GridApi<Supplier>;
  searchValue: string = '';

  columnDefs: ColDef<Supplier>[] = [
    //{ headerName: 'ID', field: 'idSupplier', sortable: true, filter: true },
    {
      headerName: 'Tipo',
      field: 'supplierType',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('supplierType'),
    },
    { headerName: 'Nombre', field: 'name', sortable: true, filter: true },
    //{ headerName: 'CUIT', field: 'cuit', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    {
      headerName: 'Teléfono',
      field: 'phoneNumber',
      sortable: true,
      filter: true,
    },
    { headerName: 'Direccion', field: 'address', sortable: true, filter: true },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE' | 'PDF', supplier: Supplier) => {
          this.handleAction(action, supplier);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Editar', icon: 'edit', action: 'EDIT' },
          { label: 'Archivos', icon: 'picture_as_pdf', action: 'PDF' },
          { label: 'Eliminar', icon: 'delete', action: 'DELETE' },
        ],
      },
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  getRowId = (params: any) => params.data.idSupplier;

  onGridReady(params: GridReadyEvent<Supplier>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.allSuppliers = data;
      },
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
      const width = window.innerWidth;
      const showColumns =
        width < 768
          ? ['name', 'supplierType', 'actions']
          : this.displayedColumns;
      const hideColumns = this.displayedColumns.filter(
        (col) => !showColumns.includes(col)
      );
      this.gridApi.setColumnsVisible(showColumns, true);
      if (width < 768) {
        this.gridApi.setColumnsVisible(hideColumns, false);
      }
      params.api.sizeColumnsToFit();
    }

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'quickFilterText',
        this.searchValue.trim().toLowerCase()
      );
    }
  }

  goToCreate(): void {
    this.router.navigate(['/suppliers/create']);
  }

  viewSupplier(id: number): void {
    const supplier = this.suppliers.find((s) => s.idSupplier === id);
    if (!supplier) return;

    this.dialog.open(ViewDialogComponent, {
      data: supplier,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editSupplier(id: number): void {
    this.router.navigate(['/suppliers/edit', id]);
  }

  deleteSupplier(id: number): void {
    this.alertService.delete('este proveedor').then((confirmed) => {
      if (confirmed) {
        this.supplierService.delete(id).subscribe({
          next: () => {
            this.suppliers = this.suppliers.filter((s) => s.idSupplier !== id);
            this.alertService.showSuccessToast(
              'Proveedor eliminado correctamente.'
            );
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar el proveedor.');
          },
        });
      }
    });
  }

  renderFile(supplier: Supplier): void {
      this.router.navigate(['/files/entity', 'supplier', supplier.idSupplier]);
    }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.suppliers,
      'Proveedores',
      [['Nombre', 'CUIT', 'Email', 'Teléfono', 'Tipo']],
      (sup) => [
        sup.name,
        sup.cuit,
        sup.email,
        sup.phoneNumber,
        sup.supplierType,
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.suppliers, 'Proveedores', (sup) => ({
      ID: sup.idSupplier,
      Nombre: sup.name,
      CUIT: sup.cuit,
      Email: sup.email,
      Teléfono: sup.phoneNumber,
      'Alias o CBU': sup.aliasCbu,
      Dirección: sup.address,
      'Tipo de Proveedor': sup.supplierType,
    }));
  }

  handleAction(
    actionType: 'VIEW' | 'EDIT' | 'DELETE' | 'PDF',
    supplier: Supplier
  ): void {
    if (actionType === 'VIEW') {
      this.viewSupplier(supplier.idSupplier);
    } else if (actionType === 'EDIT') {
      this.editSupplier(supplier.idSupplier);
    } else if (actionType === 'DELETE') {
      this.deleteSupplier(supplier.idSupplier);
    } else if (actionType === 'PDF') {
      this.renderFile(supplier);
    }
  }
}

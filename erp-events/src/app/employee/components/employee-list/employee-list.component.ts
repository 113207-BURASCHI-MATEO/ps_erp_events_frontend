import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { ExportService } from '../../../services/export.service';

import type { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-employee-list',
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
    AgGridAngular
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit{

  isBrowser: boolean;

  employees: Employee[] = [];
  allEmployees: Employee[] = [];
  displayedColumns = [
    'id',
    'firstName',
    'lastName',
    'documentType',
    'documentNumber',
    'email',
    'position',
    'hireDate',
    'actions'
  ];
  gridApi!: GridApi<Employee>;
  searchValue: string = '';

  columnDefs: ColDef<Employee>[] = [
    { headerName: 'ID', field: 'idEmployee', sortable: true, filter: true },
    { headerName: 'Nombre', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Apellido', field: 'lastName', sortable: true, filter: true },
    { headerName: 'Tipo Doc', field: 'documentType', sortable: true, filter: true },
    { headerName: 'Doc Nº', field: 'documentNumber', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Puesto', field: 'position', sortable: true, filter: true },
    { headerName: 'Contratación', field: 'hireDate', sortable: true, filter: true, valueFormatter: params => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('es-AR');
    } },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE', employee: Employee) => {
          this.handleAction(action, employee);
        }
      }
    },
  ];
  
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true
  };
  
  getRowId = (params: any) => params.data.idEmployee;

  onGridReady(params: GridReadyEvent<Employee>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }
  
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([
      ClientSideRowModelModule
    ]);
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.allEmployees = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar empleados: ${err.error.readableMessage}`);
      },
    });
  }


  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.searchValue.trim().toLowerCase());
    }
  }

  goToCreate(): void {
    this.router.navigate(['/employees/create']);
  }

  viewEmployee(id: number): void {
    const empleado = this.employees.find(e => e.idEmployee === id);
    if (!empleado) return;
  
    this.dialog.open(ViewDialogComponent, {
      data: empleado,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }
  
  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }
  
  deleteEmployee(id: number): void {
    this.alertService.delete('este empleado').then(confirmed => {
      if (confirmed) {
        this.employeeService.delete(id).subscribe({
          next: () => {
            this.employees = this.employees.filter(e => e.idEmployee !== id);
            this.alertService.showSuccessToast('Empleado eliminado correctamente.');
          },
          error: (err) => {
            this.alertService.showErrorToast(`Error al eliminar empleado ${err.error.readableMessage}`);
          }
        });
      }
    });
  }
  

  goHome(): void {
    this.router.navigate(['/landing']);
  }
  
  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.employees,
      'Empleados',
      [['Nombre', 'Apellido', 'Documento', 'Email', 'Puesto']],
      emp => [
        emp.firstName,
        emp.lastName,
        `${emp.documentType}: ${emp.documentNumber}`,
        emp.email,
        emp.position
      ]
    );
  }
  
  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.employees,
      'Empleados',
      (emp) => ({
        'ID': emp.idEmployee,
        'Nombre': emp.firstName,
        'Apellido': emp.lastName,
        'Tipo de Documento': emp.documentType,
        'Número de Documento': emp.documentNumber,
        'Email': emp.email,
        'CUIT': emp.cuit,
        'Nacimiento': emp.birthDate,
        'Alias o CBU': emp.aliasCbu,
        'Contratación': emp.hireDate,
        'Puesto': emp.position,
        'Creación': emp.creationDate,
        'Actualización': emp.updateDate,
        'Baja lógica': emp.softDelete ? 'Sí' : 'No'
      })
    );
  }

  handleAction(actionType: 'VIEW' | 'EDIT' | 'DELETE', employee: Employee): void {
    if (actionType === 'VIEW') {
      this.viewEmployee(employee.idEmployee);
    } else if (actionType === 'EDIT') {
      this.editEmployee(employee.idEmployee);
    } else if (actionType === 'DELETE') {
      this.deleteEmployee(employee.idEmployee);
    }
  }
  
}

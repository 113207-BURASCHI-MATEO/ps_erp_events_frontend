import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { EmployeeViewDialogComponent } from '../employee-view-dialog/employee-view-dialog.component';
import { ExportService } from '../../../services/export.service';


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
    EmployeeViewDialogComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit{
  employees: Employee[] = [];          // Vista filtrada
  allEmployees: Employee[] = [];       // Backup original
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
  searchValue: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private exportService: ExportService,
  ) {}

  ngOnInit(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.allEmployees = data;
      },
      error: (err) => console.error('Error al cargar empleados', err),
    });
  }

  onSearch(): void {
    const value = this.searchValue.trim().toLowerCase();

    if (!value) {
      // Si el campo está vacío, restauro la lista completa
      this.employees = this.allEmployees;
      return;
    }

    this.employees = this.allEmployees.filter(emp =>
      (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(value) ||
      emp.documentNumber.toLowerCase().includes(value) ||
      emp.documentType.toLowerCase().includes(value) ||
      emp.email.toLowerCase().includes(value)
    );
  }

  goToCreate(): void {
    this.router.navigate(['/employees/create']);
  }

  viewEmployee(id: number): void {
    const empleado = this.employees.find(e => e.id === id);
    if (!empleado) return;
  
    this.dialog.open(EmployeeViewDialogComponent, {
      data: empleado,
      width: '600px',
      maxWidth: '95vw'
    });
  }
  
  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }
  
  deleteEmployee(id: number): void {
    const confirmDelete = confirm('¿Estás seguro que deseas eliminar este empleado?');
  
    if (confirmDelete) {
      this.employeeService.delete(id).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== id);
        },
        error: (err) => console.error('Error al eliminar empleado', err),
      });
    }
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
      emp => ({
        Nombre: emp.firstName,
        Apellido: emp.lastName,
        Documento: `${emp.documentType}: ${emp.documentNumber}`,
        Email: emp.email,
        Puesto: emp.position
      })
    );
  }
  
}

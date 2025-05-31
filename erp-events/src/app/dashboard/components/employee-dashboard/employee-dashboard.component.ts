import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { map } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { MatIconModule } from '@angular/material/icon';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { COLORS } from '../../../utils/constants';
import { IaService } from '../../../services/ia.service';
import { formatIaResponse } from '../../../utils/ia-response-format';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    BaseChartDirective,
    MatIconModule,
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
})
export class EmployeeDashboardComponent {
  employees: Employee[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  };

  chartLabels: string[] = [];
  chartDatasets: ChartDataset<'bar'>[] = [
    { data: [], label: 'Empleados por Puesto' },
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  iaResponse: string = '';
  colors = COLORS;

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);
  private iaService = inject(IaService);

  constructor(
  ) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const { startDate, endDate } = this.filterForm.value;

    this.employeeService.getAll()
      .pipe(map(employees => this.filterEmployees(employees, startDate, endDate)))
      .subscribe({
        next: (filteredEmployees) => {
          this.employees = filteredEmployees;
          this.calculateKPIs();
          this.prepareChartData();
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al cargar empleados: ${err.error.readableMessage}`
          );
          console.error('Error al cargar empleados:', err);
        },
      });
  }

  getIaResponse() {
      const data = {
        employees: this.employees,
        kpiData: this.kpiData,
        chartLabels: this.chartLabels,
        chartDatasets: this.chartDatasets,
      }
      this.iaService.analyzdeDashboard(JSON.stringify(data)).subscribe({
        next: (response) => {
          this.iaResponse = response;
        },
        error: () => {
          this.alertService.showErrorToast(
            'Error al procesar la solicitud de IA. Por favor, inténtalo de nuevo más tarde.')
          console.error('Error al procesar la solicitud de IA');
          this.iaResponse = "";
        }
      });
    }
  
    formatIa(raw: string): string {
      return formatIaResponse(raw);
    }

  filterEmployees(employees: Employee[], start: Date | null, end: Date | null): Employee[] {
    if (!start && !end) return employees;
    return employees.filter((e) => {
      const hireDate = new Date(e.hireDate);
      return (!start || hireDate >= start) && (!end || hireDate <= end);
    });
  }

  calculateKPIs(): void {
    this.kpiData.totalEmployees = this.employees.length;
    this.kpiData.activeEmployees = this.employees.filter(e => !e.softDelete).length;
    this.kpiData.inactiveEmployees = this.employees.filter(e => e.softDelete).length;
  }

  prepareChartData(): void {
    const positionCounts = this.employees.reduce((acc, emp) => {
      acc[emp.position] = (acc[emp.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    this.barChartEmployeePositionLabels = Object.keys(positionCounts);
    this.barChartEmployeePositionDatasets[0].data = Object.values(positionCounts);
  
    // Bar Chart - Tipos de Evento
    const documentType = this.employees.reduce((acc, employee) => {
      acc[employee.documentType] = (acc[employee.documentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    this.pieChartEmployeeStatusLabels = Object.keys(documentType);
    this.pieChartEmployeeStatusDatasets[0].data = Object.values(documentType);
  }

  applyFilters(): void {
    this.loadData();
  }

  //#region Chart.js configuration
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      datalabels: { color: '#fff', anchor: 'end', align: 'start' },
    },
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: { color: '#fff', anchor: 'end', align: 'top' },
    },
  };

  public pieChartPlugins = [ChartDataLabels];

  public pieChartEmployeeStatusLabels: string[] = [];
  public pieChartEmployeeStatusDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public barChartEmployeePositionLabels: string[] = [];
  public barChartEmployeePositionDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Empleados por Puesto',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];
  //#endregion
}

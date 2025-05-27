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
import { MatIconModule } from '@angular/material/icon';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Supplier } from '../../../models/supplier.model';
import { SupplierService } from '../../../services/supplier.service';
import { AlertService } from '../../../services/alert.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-supplier-dashboard',
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
  templateUrl: './supplier-dashboard.component.html',
  styleUrl: './supplier-dashboard.component.scss',
})
export class SupplierDashboardComponent {
  suppliers: Supplier[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalSuppliers: 0,
    nationalSuppliers: 0,
    internationalSuppliers: 0,
  };

  chartLabels: string[] = [];
  chartDatasets: ChartDataset<'bar'>[] = [{ data: [], label: 'Proveedores por Tipo' }];

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  colors = [
    '#13505B', '#9FC2CC', '#040404', '#FF7F11', '#D7D9CE', '#CC650D',
    '#FF8080', '#FFC7C7', '#C11414', '#F8F9FA', '#FFFFFF', '#333333',
    '#777777', '#08703B', '#FFAB91'
  ];

    private fb = inject(FormBuilder);
      private supplierService = inject(SupplierService);
      private alertService = inject(AlertService);

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

    this.supplierService
      .getAll()
      .pipe(map((suppliers) => this.filterSuppliers(suppliers, startDate, endDate)))
      .subscribe({
        next: (filteredSuppliers) => {
          this.suppliers = filteredSuppliers;
          this.calculateKPIs();
          this.prepareChartData();
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al cargar proveedores: ${err.error?.message || err.message}`
          );
          console.error('Error al cargar proveedores:', err);
        },
      });
  }

  filterSuppliers(suppliers: Supplier[], start: Date | null, end: Date | null): Supplier[] {
    /* if (!start && !end) return suppliers;
    return suppliers.filter((s) => {
      const createdDate = new Date(s['createdAt']); // Ajusta esto según tu modelo
      return (!start || createdDate >= start) && (!end || createdDate <= end);
    }); */
    return suppliers;
  }

  calculateKPIs(): void {
    this.kpiData.totalSuppliers = this.suppliers.length;
    this.kpiData.nationalSuppliers = this.suppliers.filter(
      (s) => s.supplierType === 'NACIONAL'
    ).length;
    this.kpiData.internationalSuppliers = this.suppliers.filter(
      (s) => s.supplierType === 'INTERNACIONAL'
    ).length;
  }

  prepareChartData(): void {
    const typeCounts = this.suppliers.reduce((acc, supplier) => {
      acc[supplier.supplierType] = (acc[supplier.supplierType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.barChartSupplierTypeLabels = Object.keys(typeCounts);
    this.barChartSupplierTypeDatasets[0].data = Object.values(typeCounts);

    this.pieChartSupplierTypeLabels = Object.keys(typeCounts);
    this.pieChartSupplierTypeDatasets[0].data = Object.values(typeCounts);
  }

  applyFilters(): void {
    this.loadData();
  }

  // #region Chart.js Configuration
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

  public pieChartSupplierTypeLabels: string[] = [];
  public pieChartSupplierTypeDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public barChartSupplierTypeLabels: string[] = [];
  public barChartSupplierTypeDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Tipos de Proveedor',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];
  // #endregion
}

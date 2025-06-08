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
import { Guest } from '../../../../models/guest.model';
import { GuestService } from '../../../../services/guest.service';
import { map } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
import { MatIconModule } from '@angular/material/icon';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { COLORS } from '../../../../utils/constants';
import { IaService } from '../../../../services/ia.service';
import { formatIaResponse } from '../../../../utils/ia-response-format';

@Component({
  selector: 'app-guest-dashboard',
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
  templateUrl: './guest-dashboard.component.html',
  styleUrl: './guest-dashboard.component.scss',
})
export class GuestDashboardComponent {
  guests: Guest[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalGuests: 0,
    vipGuests: 0,
    staffGuests: 0,
    familyGuests: 0,
  };

  chartLabels: string[] = [];
  chartDatasets: ChartDataset<'bar'>[] = [
    { data: [], label: 'Invitados por Tipo' },
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
  private guestService = inject(GuestService);
  private alertService = inject(AlertService);
  private iaService = inject(IaService);

  constructor() {
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

    this.guestService
      .getAll()
      .pipe(map((guests) => this.filterGuests(guests, startDate, endDate)))
      .subscribe({
        next: (filteredGuests) => {
          this.guests = filteredGuests;
          this.calculateKPIs();
          this.prepareChartData();
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al cargar invitados: ${err.error?.message || err.message}`
          );
          console.error('Error al cargar invitados:', err);
        },
      });
  }

  getIaResponse() {
    const data = {
      guests: this.guests,
      kpiData: this.kpiData,
      chartLabels: this.chartLabels,
      chartDatasets: this.chartDatasets,
    };
    this.iaService.analyzdeDashboard(JSON.stringify(data)).subscribe({
      next: (response) => {
        this.iaResponse = response;
      },
      error: () => {
        this.alertService.showErrorToast(
          'Error al procesar la solicitud de IA. Por favor, inténtalo de nuevo más tarde.'
        );
        console.error('Error al procesar la solicitud de IA');
        this.iaResponse = '';
      },
    });
  }

  formatIa(raw: string): string {
    return formatIaResponse(raw);
  }

  filterGuests(guests: Guest[], start: Date | null, end: Date | null): Guest[] {
    if (!start && !end) return guests;
    return guests.filter((g: Guest) => {
      const birthDate = new Date(g.birthDate);
      return (!start || birthDate >= start) && (!end || birthDate <= end);
    });
  }

  calculateKPIs(): void {
    this.kpiData.totalGuests = this.guests.length;
    this.kpiData.vipGuests = this.guests.filter((g) => g.type === 'VIP').length;
    this.kpiData.staffGuests = this.guests.filter(
      (g) => g.type === 'STAFF'
    ).length;
    this.kpiData.familyGuests = this.guests.filter(
      (g) => g.type === 'FAMILY'
    ).length;
  }

  prepareChartData(): void {
    const typeCounts = this.guests.reduce((acc, guest) => {
      acc[guest.type] = (acc[guest.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.pieChartGuestTypeLabels = Object.keys(typeCounts);
    this.pieChartGuestTypeDatasets[0].data = Object.values(typeCounts);

    this.barChartGuestTypeLabels = Object.keys(typeCounts);
    this.barChartGuestTypeDatasets[0].data = Object.values(typeCounts);
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

  public pieChartGuestTypeLabels: string[] = [];
  public pieChartGuestTypeDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public barChartGuestTypeLabels: string[] = [];
  public barChartGuestTypeDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Tipos de Invitados',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];
  //#endregion
}

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartType,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { map } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { MatIconModule } from '@angular/material/icon';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-general',
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
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
})
export class GeneralComponent {
  events: Event[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalEvents: 0,
    confirmedEvents: 0,
    pendingEvents: 0,
    cancelledEvents: 0,
  };

  chartLabels: string[] = [];
  chartDatasets: ChartDataset<'bar'>[] = [
    { data: [], label: 'Eventos por Estado' },
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  colors = [
    '#13505B',  // Primary - Midnight Green
    '#9FC2CC',  // Primary Light
    '#040404',  // Primary Dark (Almost Black)
    '#FF7F11',  // Accent - Vibrant Orange
    '#D7D9CE',  // Accent Light - Soft Gray
    '#CC650D',  // Accent Dark - Dark Orange
    '#FF8080',  // Warn - Soft Red
    '#FFC7C7',  // Warn Light - Light Red
    '#C11414',  // Warn Dark - Strong Red
    '#F8F9FA',  // Background Light Gray
    '#FFFFFF',  // Pure White
    '#333333',  // Dark Text
    '#777777',  // Medium Gray Text
    '#08703B',  // Success / Confirmation Green
    '#FFAB91'   // Extra Accent - Soft Coral
  ];

  private fb = inject(FormBuilder);
    private eventService = inject(EventService);
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

    this.eventService
      .getAll()
      .pipe(map((events) => this.filterEvents(events, startDate, endDate)))
      .subscribe({
        next: (filteredEvents) => {
          this.events = filteredEvents;
          this.calculateKPIs();
          this.prepareChartData();
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al cargar eventos: ${err.error?.message || err.message}`
          );
          console.error('Error al cargar eventos:', err);
        },
      });
  }

  filterEvents(events: Event[], start: Date | null, end: Date | null): Event[] {
    if (!start && !end) return events;
    return events.filter((e) => {
      const eventDate = new Date(e.startDate);
      return (!start || eventDate >= start) && (!end || eventDate <= end);
    });
  }

  calculateKPIs(): void {
    this.kpiData.totalEvents = this.events.length;
    this.kpiData.confirmedEvents = this.events.filter(
      (e) => e.status === 'CONFIRMED'
    ).length;
    this.kpiData.pendingEvents = this.events.filter(
      (e) => e.status === 'PENDING'
    ).length;
    this.kpiData.cancelledEvents = this.events.filter(
      (e) => e.status === 'CANCELLED'
    ).length;
  }

  prepareChartData(): void {
    // Pie Chart - Estados de Evento
    const statusCounts = this.events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    this.pieChartEventStatusLabels = Object.keys(statusCounts);
    this.pieChartEventStatusDatasets[0].data = Object.values(statusCounts);
  
    // Bar Chart - Tipos de Evento
    const typeCounts = this.events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    this.barChartEventTypeLabels = Object.keys(typeCounts);
    this.barChartEventTypeDatasets[0].data = Object.values(typeCounts);
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

  // Pie Chart Data (Estados de Evento)
  public pieChartEventStatusLabels: string[] = [];
  public pieChartEventStatusDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  // Bar Chart Data (Tipos de Evento)
  public barChartEventTypeLabels: string[] = [];
  public barChartEventTypeDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Tipos de Evento',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];
  //#endregion Chart.js configuration
}

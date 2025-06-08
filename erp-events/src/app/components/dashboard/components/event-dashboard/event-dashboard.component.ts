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
import { Event } from '../../../../models/event.model';
import { EventService } from '../../../../services/event.service';
import { map } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
import { MatIconModule } from '@angular/material/icon';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { COLORS } from '../../../../utils/constants';
import { IaService } from '../../../../services/ia.service';
import { formatIaResponse } from '../../../../utils/ia-response-format';

@Component({
  selector: 'app-event-dashboard',
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
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.scss',
})
export class EventDashboardComponent {
  events: Event[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalEvents: 0,
    confirmedEvents: 0,
    pendingEvents: 0,
    cancelledEvents: 0,
    averageDurationHours: '0',
    averageGuests: '0',
    averageEmployees: '0',
    tasksPerEvent: '0',
    eventsWithSoftDelete: 0,
  };

  fake = [
    {
      idEvent: 1,
      title: 'Evento A',
      description: '',
      eventType: 'Conferencia',
      startDate: '2025-01-10T10:00:00',
      endDate: '2025-01-10T14:00:00',
      status: 'CONFIRMED',
      softDelete: false,
      creationDate: '',
      updateDate: '',
      client: { name: 'Cliente X' },
      location: { name: 'Sala 1' },
      employeesIds: [],
      employees: [],
      suppliersIds: [],
      suppliers: [],
      guests: Array(25).fill({}),
      tasks: [],
      account: {}
    },
    {
      idEvent: 2,
      title: 'Evento B',
      description: '',
      eventType: 'Reunión',
      startDate: '2025-02-15T09:00:00',
      endDate: '2025-02-15T18:00:00',
      status: 'CONFIRMED',
      softDelete: false,
      creationDate: '',
      updateDate: '',
      client: { name: 'Cliente Y' },
      location: { name: 'Sala 2' },
      employeesIds: [],
      employees: [],
      suppliersIds: [],
      suppliers: [],
      guests: Array(40).fill({}),
      tasks: [],
      account: {}
    },
    {
      idEvent: 3,
      title: 'Evento C',
      description: '',
      eventType: 'Seminario',
      startDate: '2025-02-20T13:00:00',
      endDate: '2025-02-20T15:00:00',
      status: 'PENDING',
      softDelete: false,
      creationDate: '',
      updateDate: '',
      client: { name: 'Cliente X' },
      location: { name: 'Sala 1' },
      employeesIds: [],
      employees: [],
      suppliersIds: [],
      suppliers: [],
      guests: Array(10).fill({}),
      tasks: [],
      account: {}
    },
    {
      idEvent: 4,
      title: 'Evento D',
      description: '',
      eventType: 'Taller',
      startDate: '2025-03-05T08:00:00',
      endDate: '2025-03-05T17:00:00',
      status: 'CANCELLED',
      softDelete: false,
      creationDate: '',
      updateDate: '',
      client: { name: 'Cliente Z' },
      location: { name: 'Sala 3' },
      employeesIds: [],
      employees: [],
      suppliersIds: [],
      suppliers: [],
      guests: Array(30).fill({}),
      tasks: [],
      account: {}
    }
  ];

  iaResponse: string = '';
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

  colors = COLORS;

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
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

    this.eventService
      .getAll()
      .pipe(map((events) => this.filterEvents(events, startDate, endDate)))
      .subscribe({
        next: (filteredEvents) => {
          this.events = filteredEvents;
          console.log('EVENTOS', this.events);
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

  getIaResponse() {
    const data = {
      events: this.events,
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

    // ---- KPIs adicionales ----
    const durations = this.events.map((e) => {
      const start = new Date(e.startDate).getTime();
      const end = new Date(e.endDate).getTime();
      return (end - start) / (1000 * 60 * 60); // horas
    });
    this.kpiData.averageDurationHours = durations.length
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
      : '0';

    this.kpiData.averageGuests = this.events.length
      ? (
          this.events.reduce((sum, e) => sum + (e.guests?.length || 0), 0) /
          this.events.length
        ).toFixed(1)
      : '0';

    this.kpiData.averageEmployees = this.events.length
      ? (
          this.events.reduce((sum, e) => sum + (e.employees?.length || 0), 0) /
          this.events.length
        ).toFixed(1)
      : '0';

    this.kpiData.tasksPerEvent = this.events.length
      ? (
          this.events.reduce((sum, e) => sum + (e.tasks?.length || 0), 0) /
          this.events.length
        ).toFixed(1)
      : '0';

    this.kpiData.eventsWithSoftDelete = this.events.filter(
      (e) => e.softDelete
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

    const locationCounts = this.events.reduce((acc, e) => {
      const loc = e.location?.fantasyName || 'Sin ubicación';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    this.barChartByLocationLabels = Object.keys(locationCounts);
    this.barChartByLocationDatasets[0].data = Object.values(locationCounts);

    const clientCounts = this.events.reduce((acc, e) => {
      const client = e.client?.firstName || 'Sin cliente';
      acc[client] = (acc[client] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    this.barChartByClientLabels = Object.keys(clientCounts);
    this.barChartByClientDatasets[0].data = Object.values(clientCounts);

    const eventsByMonth: Record<string, number> = {};
    const points: { x: number; y: number }[] = [];
    this.fake.forEach((e) => {
      const date = new Date(e.startDate);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      eventsByMonth[key] = (eventsByMonth[key] || 0) + 1;

      const duration =
        (new Date(e.endDate).getTime() - new Date(e.startDate).getTime()) /
        (1000 * 60 * 60);
      const guests = e.guests?.length || 0;
      points.push({ x: duration, y: guests });
    });
    console.log("PUNTOS", points);
    
    this.lineChartEventsPerMonthLabels = Object.keys(eventsByMonth).sort();
    this.lineChartEventsPerMonthDatasets[0].data =
      this.lineChartEventsPerMonthLabels.map((label) => eventsByMonth[label]);
    this.scatterChartDurationVsGuestsDatasets[0].data = points;
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

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      datalabels: { color: '#fff', anchor: 'end', align: 'top' },
    },
  };

  public scatterChartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'nearest', intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Duración (h)' },
        min: 0,
        max: 10
      },
      y: {
        title: { display: true, text: 'Invitados' },
        min: 0,
        max: 50
      },
    }
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

  public barChartByLocationLabels: string[] = [];
  public barChartByLocationDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Eventos por Ubicación',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public barChartByClientLabels: string[] = [];
  public barChartByClientDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Eventos por Cliente',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public lineChartEventsPerMonthLabels: string[] = [];
  public lineChartEventsPerMonthDatasets: ChartDataset<'line', number[]>[] = [
    {
      data: [],
      label: 'Eventos por Mes',
      fill: false,
      tension: 0.3,
      borderColor: this.colors[0],
      backgroundColor: this.colors[0],
      pointBackgroundColor: this.colors[0],
      pointBorderColor: '#fff',
    },
  ];

  public scatterChartDurationVsGuestsDatasets: ChartDataset<
    'scatter',
    { x: number; y: number }[]
  >[] = [
    {
      label: 'Duración vs. Invitados',
      data: [],
      backgroundColor: this.colors[1],
    },
  ];

  //#endregion Chart.js configuration
}

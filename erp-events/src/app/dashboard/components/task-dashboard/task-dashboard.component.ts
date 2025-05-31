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

import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { AlertService } from '../../../services/alert.service';
import { map } from 'rxjs';
import { COLORS } from '../../../utils/constants';
import { IaService } from '../../../services/ia.service';
import { formatIaResponse } from '../../../utils/ia-response-format';

@Component({
  selector: 'app-task-dashboard',
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
  templateUrl: './task-dashboard.component.html',
  styleUrl: './task-dashboard.component.scss',
})
export class TaskDashboardComponent {
  tasks: Task[] = [];
  filterForm: FormGroup;
  kpiData = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    cancelledTasks: 0,
  };

  chartLabels: string[] = [];
  chartDatasets: ChartDataset<'bar'>[] = [
    { data: [], label: 'Tareas por Estado' },
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
  private taskService = inject(TaskService);
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

    this.taskService
      .getAll()
      .pipe(map((tasks) => this.filterTasks(tasks, startDate, endDate)))
      .subscribe({
        next: (filteredTasks) => {
          this.tasks = filteredTasks;
          this.calculateKPIs();
          this.prepareChartData();
        },
        error: (err) => {
          this.alertService.showErrorToast(
            `Error al cargar tareas: ${err.error?.message || err.message}`
          );
          console.error('Error al cargar tareas:', err);
        },
      });
  }

  getIaResponse() {
    const data = {
      tasks: this.tasks,
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

  filterTasks(tasks: Task[], start: Date | null, end: Date | null): Task[] {
    if (!start && !end) return tasks;
    return tasks.filter((t: Task) => {
      const createdDate = new Date(t['creationDate']);
      return (!start || createdDate >= start) && (!end || createdDate <= end);
    });
    return tasks;
  }

  calculateKPIs(): void {
    this.kpiData.totalTasks = this.tasks.length;
    this.kpiData.completedTasks = this.tasks.filter(
      (t) => t.status === 'COMPLETED'
    ).length;
    this.kpiData.pendingTasks = this.tasks.filter(
      (t) => t.status === 'PENDING'
    ).length;
    this.kpiData.cancelledTasks = this.tasks.filter(
      (t) => t.status === 'CANCELLED'
    ).length;
  }

  prepareChartData(): void {
    const statusCounts = this.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.pieChartTaskStatusLabels = Object.keys(statusCounts);
    this.pieChartTaskStatusDatasets[0].data = Object.values(statusCounts);

    const eventCounts = this.tasks.reduce((acc, task) => {
      acc[task.idEvent] = (acc[task.idEvent] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    this.barChartTaskEventLabels = Object.keys(eventCounts).map(
      (e) => `Evento ${e}`
    );
    this.barChartTaskEventDatasets[0].data = Object.values(eventCounts);
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

  public pieChartTaskStatusLabels: string[] = [];
  public pieChartTaskStatusDatasets: ChartDataset<'pie', number[]>[] = [
    {
      data: [],
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];

  public barChartTaskEventLabels: string[] = [];
  public barChartTaskEventDatasets: ChartDataset<'bar', number[]>[] = [
    {
      data: [],
      label: 'Tareas por Evento',
      backgroundColor: this.colors,
      hoverBackgroundColor: this.colors,
      borderColor: this.colors,
      borderWidth: 1,
    },
  ];
  //#endregion
}

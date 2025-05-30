import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';

import { ScheduleService } from '../../../services/schedule.service';
import { TaskService } from '../../../services/task.service';
import { AlertService } from '../../../services/alert.service';
import { Task } from '../../../models/task.model';
import { TimeSchedule } from '../../../models/schedule.model';
import { ExportService } from '../../../services/export.service';
import { MatIconModule } from '@angular/material/icon';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { renderIconField } from '../../../utils/render-icon';

@Component({
  selector: 'app-schedule-timing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    AgGridAngular,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './schedule-timing.component.html',
  styleUrl: './schedule-timing.component.scss',
})
export class ScheduleTimingComponent implements OnInit {
  isBrowser: boolean;
  searchValue: string = '';

  private route = inject(ActivatedRoute);
  private scheduleService = inject(ScheduleService);
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);
  private exportService = inject(ExportService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  gridApi!: GridApi;
  columnDefs: ColDef[] = [
    {
      headerName: 'Horario',
      field: 'date',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleString('es-AR');
      },
    },
    { headerName: 'Título', field: 'task.title', sortable: true, filter: true },
    {
      headerName: 'Descripción',
      field: 'task.description',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Estado',
      field: 'task.status',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('taskStatus'),
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW', row: { date: string; task: Task }) => {
          this.handleAction(action, row);
        },
        actions: [{ label: 'Ver', icon: 'visibility', action: 'VIEW' }],
      },
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
  };
  rowData: { date: string; task: Task }[] = [];

  schedule: TimeSchedule | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    this.route.paramMap.subscribe((params) => {
      const idTimeScheduleParam = params.get('scheduleId');
      const idEventParam = params.get('eventId');

      const idTimeSchedule = idTimeScheduleParam
        ? Number(idTimeScheduleParam)
        : null;
      const idEvent = idEventParam ? Number(idEventParam) : null;

      if (idTimeSchedule && idEvent) {
        this.loadScheduleWithTasks(idTimeSchedule, idEvent);
      } else {
        this.alertService.showErrorToast('Parámetros de ruta inválidos.');
      }
    });
  }

  loadScheduleWithTasks(idTimeSchedule: number, idEvent: number): void {
    this.scheduleService.getById(idTimeSchedule).subscribe({
      next: (schedule) => {
        this.schedule = schedule;
        this.taskService.getTasksFromEvent(idEvent).subscribe({
          next: (tasks) => {
            this.rowData = Object.entries(schedule.scheduledTasks || {})
              .map(([date, taskId]) => {
                const task = tasks.find((t) => t.idTask === taskId);
                return task ? { date, task } : null;
              })
              .filter((item): item is { date: string; task: Task } => !!item)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          },
          error: () =>
            this.alertService.showErrorToast(
              'No se pudieron cargar las tareas.'
            ),
        });
      },
      error: () =>
        this.alertService.showErrorToast('No se pudo cargar el cronograma.'),
    });
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
  }

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'quickFilterText',
        this.searchValue.trim().toLowerCase()
      );
    }
  }

  viewSchedule(id: number): void {
    const item = this.rowData.find((d) => d.task.idTask === id);
    if (!item) return;

    this.dialog.open(ViewDialogComponent, {
      data: item.task,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  goBack(): void {
    this.router.navigate(['/schedules']);
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.rowData,
      'Tareas Cronograma',
      (item) => ({
        Horario: item.date,
        Título: item.task.title,
        Descripción: item.task.description,
        Estado: item.task.status,
      })
    );
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.rowData,
      'Tareas Cronograma',
      [['Horario', 'Título', 'Descripción', 'Estado']],
      (item) => [
        item.date,
        item.task.title,
        item.task.description,
        item.task.status,
      ]
    );
  }

  handleAction(action: 'VIEW', row: { date: string; task: Task }): void {
    if (action === 'VIEW') {
      this.viewSchedule(row.task.idTask);
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from '../../../../services/export.service';
import { Task } from '../../../../models/task.model';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { TaskService } from '../../../../services/task.service';

import type { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../../services/alert.service';
import { Event } from '../../../../models/event.model';
import { EventService } from '../../../../services/event.service';
import { MatSelectModule } from '@angular/material/select';
import { renderIconField } from '../../../../utils/render-icon';

@Component({
  selector: 'app-task-list',
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
    MatSelectModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  isBrowser: boolean;
  eventId: number | null = null;
  events: Event[] = [];
  tasks: Task[] = [];
  allTasks: Task[] = [];
  displayedColumns = [
    'idTask',
    'title',
    'description',
    'status',
    'idEvent',
    'actions',
  ];
  gridApi!: GridApi<Task>;
  searchValue: string = '';

  columnDefs: ColDef<Task>[] = [
    //{ headerName: 'ID', field: 'idTask', sortable: true, filter: true },
    {
      headerName: 'Estado',
      field: 'status',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('taskStatus'),
    },
    { headerName: 'Título', field: 'title', sortable: true, filter: true },
    {
      headerName: 'Descripción',
      field: 'description',
      sortable: true,
      filter: true,
    },
    //{ headerName: 'ID Evento', field: 'idEvent', sortable: true, filter: true },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE' | string, task: Task) => {
          this.handleAction(action, task);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Editar', icon: 'edit', action: 'EDIT' },
          { label: 'Estado', icon: 'swap_horiz', action: 'STATUS' },
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

  getRowId = (params: any) => params.data.idTask;

  onGridReady(params: GridReadyEvent<Task>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  private taskService = inject(TaskService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.route.queryParams.subscribe((params) => {
      const eventId = params['eventId'];
      if (eventId) {
        this.eventId = +eventId;
      }
    });
    this.loadEvents();
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
      const width = window.innerWidth;
      const showColumns =
        width < 768
          ? ['title', 'status', 'actions']
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

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        if (this.eventId) {
          this.taskService.getTasksFromEvent(this.eventId).subscribe({
            next: (data) => {
              this.tasks = data;
              this.allTasks = data;
            },
            error: (err) => {
              console.error('Error al obtener las tareas', err);
              this.alertService.showErrorToast('Error al cargar las tareas.');
            },
          });
        } else {
          this.taskService.getAll().subscribe({
            next: (data) => {
              this.tasks = data;
              this.allTasks = data;
            },
            error: (err) => {
              console.error('Error al obtener las tareas', err);
              this.alertService.showErrorToast('Error al cargar las tareas.');
            },
          });
        }
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar eventos: ${err.error?.message || err.message}`
        );
        console.error('Error al cargar eventos:', err);
      },
    });
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
    this.router.navigate(['/tasks/create']);
  }

  viewTask(id: number): void {
    const task = this.tasks.find((t) => t.idTask === id);
    if (!task) return;

    this.dialog.open(ViewDialogComponent, {
      data: task,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  deleteTask(id: number): void {
    this.alertService.delete('esta tarea').then((confirmed) => {
      if (confirmed) {
        this.taskService.delete(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter((t) => t.idTask !== id);
            this.alertService.showSuccessToast(
              'Tarea eliminada correctamente.'
            );
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar la tarea.');
          },
        });
      }
    });
  }

  changeTaskStatus(id: number): void {
    const statusOptions = [
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'IN_PROGRESS', label: 'En Progreso' },
      { value: 'COMPLETED', label: 'Completada' },
      { value: 'CANCELLED', label: 'Cancelada' },
    ];

    this.alertService
      .selectOption<string>(
        'Asignar nuevo estado',
        'Seleccione un estado para la tarea:',
        statusOptions
      )
      .then((taskStatus) => {
        if (taskStatus === null) return;
        this.taskService.changeStatus(id, taskStatus).subscribe({
          next: (task: Task) => {
            this.tasks = this.tasks.map((t) => {
              if (t.idTask === id) {
                task.idEvent = t.idEvent;
                return task;
              } else {
                return t;
              }
            });
            this.alertService.showSuccessToast(
              'Tarea actualizada correctamente.'
            );
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al actualizar la tarea: ${err.error.readableMessage}`
            );
          },
        });
      });
  }

  onEventSelected(eventId: number): void {
    if (!eventId) return;
    this.eventId = eventId;
    this.taskService.getTasksFromEvent(eventId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar las tareas del evento: ${err.error.readableMessage}`
        );
      },
    });
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.tasks,
      'Tareas',
      [['Título', 'Descripción', 'Estado', 'ID Evento']],
      (task) => [task.title, task.description, task.status, task.idEvent]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.tasks, 'Tareas', (task) => ({
      ID: task.idTask,
      Título: task.title,
      Descripción: task.description,
      Estado: task.status,
      'ID Evento': task.idEvent,
    }));
  }

  handleAction(
    actionType: 'VIEW' | 'EDIT' | 'DELETE' | string,
    task: Task
  ): void {
    if (actionType === 'VIEW') {
      this.viewTask(task.idTask);
    } else if (actionType === 'EDIT') {
      this.editTask(task.idTask);
    } else if (actionType === 'DELETE') {
      this.deleteTask(task.idTask);
    } else if (actionType === 'STATUS') {
      this.changeTaskStatus(task.idTask);
    }
  }
}

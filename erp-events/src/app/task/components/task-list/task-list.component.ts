import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExportService } from '../../../services/export.service';
import { Task } from '../../../models/task.model';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { TaskService } from '../../../services/task.service';

import type { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../services/alert.service';

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
    AgGridAngular
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  isBrowser: boolean;

  tasks: Task[] = [];
  allTasks: Task[] = [];
  displayedColumns = ['idTask', 'title', 'description', 'status', 'idEvent', 'actions'];
  gridApi!: GridApi<Task>;
  searchValue: string = '';

  columnDefs: ColDef<Task>[] = [
    { headerName: 'ID', field: 'idTask', sortable: true, filter: true },
    { headerName: 'Título', field: 'title', sortable: true, filter: true },
    { headerName: 'Descripción', field: 'description', sortable: true, filter: true },
    { headerName: 'Estado', field: 'status', sortable: true, filter: true },
    { headerName: 'ID Evento', field: 'idEvent', sortable: true, filter: true },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE', task: Task) => {
          this.handleAction(action, task);
        }
      }
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true
  };

  getRowId = (params: any) => params.data.idTask;

  onGridReady(params: GridReadyEvent<Task>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog,
    private exportService: ExportService,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.allTasks = data;
      },
      error: (err) => console.error('Error al cargar tareas', err),
    });
  }

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.searchValue.trim().toLowerCase());
    }
  }

  goToCreate(): void {
    this.router.navigate(['/tasks/create']);
  }

  viewTask(id: number): void {
    const task = this.tasks.find(t => t.idTask === id);
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
    this.alertService.delete('esta tarea').then(confirmed => {
      if (confirmed) {
        this.taskService.delete(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(t => t.idTask !== id);
            this.alertService.showSuccessToast('Tarea eliminada correctamente.');
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar la tarea.');
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
      this.tasks,
      'Tareas',
      [['Título', 'Descripción', 'Estado', 'ID Evento']],
      task => [
        task.title,
        task.description,
        task.status,
        task.idEvent
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.tasks,
      'Tareas',
      (task) => ({
        'ID': task.idTask,
        'Título': task.title,
        'Descripción': task.description,
        'Estado': task.status,
        'ID Evento': task.idEvent
      })
    );
  }

  handleAction(actionType: 'VIEW' | 'EDIT' | 'DELETE', task: Task): void {
    if (actionType === 'VIEW') {
      this.viewTask(task.idTask);
    } else if (actionType === 'EDIT') {
      this.editTask(task.idTask);
    } else if (actionType === 'DELETE') {
      this.deleteTask(task.idTask);
    }
  }
}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';

import { OptionsComponent } from '../../../shared/components/options/options.component';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';

import { TimeSchedule } from '../../../models/schedule.model';
import { ScheduleService } from '../../../services/schedule.service';
import { ExportService } from '../../../services/export.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-schedule-list',
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
  ],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss',
})
export class ScheduleListComponent implements OnInit {
  isBrowser: boolean;

  schedules: TimeSchedule[] = [];
  allSchedules: TimeSchedule[] = [];
  gridApi!: GridApi<TimeSchedule>;
  searchValue: string = '';

  columnDefs: ColDef<TimeSchedule>[] = [
    { headerName: 'ID', field: 'idTimeSchedule', sortable: true, filter: true },
    { headerName: 'Titulo', field: 'title', sortable: true, filter: true },
    { headerName: 'Descripcion', field: 'description', sortable: true, filter: true },
    { headerName: 'Evento ID', field: 'idEvent', sortable: true, filter: true },
    {
      headerName: 'Cantidad de Tareas',
      valueGetter: (params) => Object.keys(params.data?.scheduledTasks || {}).length,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE', schedule: TimeSchedule) => {
          this.handleAction(action, schedule);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Editar', icon: 'edit', action: 'EDIT' },
          { label: 'Timing', icon: 'timer', action: 'TIMING' },
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

  getRowId = (params: any) => params.data.idTimeSchedule;

  private timeScheduleService = inject(ScheduleService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    this.timeScheduleService.getAll().subscribe({
      next: (data) => {
        this.schedules = data;
        this.allSchedules = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar cronogramas: ${err.error.readableMessage}`);
      },
    });
  }

  onGridReady(params: GridReadyEvent<TimeSchedule>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', this.searchValue.trim().toLowerCase());
    }
  }

  goToCreate(): void {
    this.router.navigate(['/schedules/create']);
  }

  viewSchedule(id: number): void {
    const schedule = this.schedules.find(s => s.idTimeSchedule === id);
    if (!schedule) return;

    this.dialog.open(ViewDialogComponent, {
      data: schedule,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editSchedule(id: number): void {
    this.router.navigate(['/schedules/edit', id]);
  }

  deleteSchedule(id: number): void {
    this.alertService.delete('este cronograma').then((confirmed) => {
      if (confirmed) {
        this.timeScheduleService.delete(id).subscribe({
          next: () => {
            this.schedules = this.schedules.filter(s => s.idTimeSchedule !== id);
            this.alertService.showSuccessToast('Cronograma eliminado correctamente.');
          },
          error: (err) => {
            this.alertService.showErrorToast(`Error al eliminar cronograma: ${err.error.readableMessage}`);
          },
        });
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.schedules,
      'Cronogramas',
      [['ID', 'Evento', 'Cantidad de Tareas']],
      (s) => [
        s.idTimeSchedule.toString(),
        s.idEvent.toString(),
        Object.keys(s.scheduledTasks || {}).length.toString(),
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.schedules,
      'Cronogramas',
      (s) => ({
        'ID': s.idTimeSchedule,
        'Evento': s.idEvent,
        'Cantidad de Tareas': Object.keys(s.scheduledTasks || {}).length,
      })
    );
  }

  handleAction(actionType: 'VIEW' | 'EDIT' | 'DELETE', schedule: TimeSchedule): void {
    if (actionType === 'VIEW') {
      this.viewSchedule(schedule.idTimeSchedule);
    } else if (actionType === 'EDIT') {
      this.editSchedule(schedule.idTimeSchedule);
    } else if (actionType === 'DELETE') {
      this.deleteSchedule(schedule.idTimeSchedule);
    } else if (actionType === 'TIMING') {
      this.router.navigate(['/schedules/timing', schedule.idTimeSchedule, schedule.idEvent]);
    }
  }
}

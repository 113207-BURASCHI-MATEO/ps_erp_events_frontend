import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventService } from '../../../services/event.service';
import { ExportService } from '../../../services/export.service';
import { Router } from '@angular/router';
import { Event, EventStatus } from '../../../models/event.model';
import { MatDialog } from '@angular/material/dialog';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { AgGridAngular } from '@ag-grid-community/angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../services/alert.service';
import { renderIconField } from '../../../utils/render-icon';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    ViewDialogComponent,
    OptionsComponent,
    AgGridAngular,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent {
  isBrowser: boolean;

  events: Event[] = [];
  allEvents: Event[] = [];
  displayedColumns = [
    'idEvent',
    'title',
    'description',
    'eventType',
    'startDate',
    'endDate',
    'status',
    'actions',
  ];
  gridApi!: GridApi<Event>;
  searchValue = '';

  columnDefs: ColDef<Event>[] = [
    { headerName: 'ID', field: 'idEvent', sortable: true, filter: true },
    { headerName: 'Título', field: 'title', sortable: true, filter: true },
    {
      headerName: 'Descripción',
      field: 'description',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Tipo',
      field: 'eventType',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('eventType'),
    },
    { headerName: 'Inicio', field: 'startDate', sortable: true, filter: true, valueFormatter: params => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('es-AR');
    } },
    { headerName: 'Fin', field: 'endDate', sortable: true, filter: true, valueFormatter: params => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('es-AR');
    } },
    {
      headerName: 'Estado',
      field: 'status',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('eventStatus'),
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (
          action: 'VIEW' | 'EDIT' | 'DELETE' | string,
          event: Event
        ) => {
          this.handleAction(action, event);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Estado', icon: 'published_with_changes', action: 'STATUS' },
          { label: 'Editar', icon: 'edit', action: 'EDIT' },
          { label: 'Invitados', icon: 'room_service', action: 'GUESTS' },
          { label: 'Tareas', icon: 'inventory', action: 'TASKS' },
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

  getRowId = (params: any) => params.data.idEvent;

  onGridReady(params: GridReadyEvent<Event>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  private eventService = inject(EventService);
  private exportService = inject(ExportService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private alertService = inject(AlertService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.allEvents = data;
        this.validateEventStatus();
      },
      error: (err) => {
        console.error('Error al cargar eventos', err);
        this.alertService.showErrorToast('Error al cargar eventos.');
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
    this.router.navigate(['/events/create']);
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  viewEvent(id: number): void {
    const evento = this.events.find((e) => e.idEvent === id);
    if (!evento) return;

    this.dialog.open(ViewDialogComponent, {
      data: evento,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editEvent(id: number): void {
    this.router.navigate(['/events/edit', id]);
  }

  deleteEvent(id: number): void {
    this.alertService.delete('este evento').then((confirmed) => {
      if (confirmed) {
        this.eventService.delete(id).subscribe({
          next: () => {
            this.events = this.events.filter((e) => e.idEvent !== id);
            this.alertService.showSuccessToast(
              'Evento eliminado correctamente.'
            );
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar el evento.');
          },
        });
      }
    });
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.events,
      'Eventos',
      [['Título', 'Tipo', 'Estado', 'Inicio', 'Fin']],
      (event) => [
        event.title,
        event.eventType,
        event.status,
        this.formatDate(event.startDate),
        this.formatDate(event.endDate),
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.events, 'Eventos', (event) => ({
      ID: event.idEvent,
      Título: event.title,
      Descripción: event.description,
      Tipo: event.eventType,
      Estado: event.status,
      Inicio: this.formatDate(event.startDate),
      Fin: this.formatDate(event.endDate),
      Cliente: `${event.client?.firstName} ${event.client?.lastName}`,
      Ubicación: event.location?.fantasyName,
      Creación: event.creationDate,
      Actualización: event.updateDate,
      'Baja lógica': event.softDelete ? 'Sí' : 'No',
    }));
  }

  private formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }

  handleAction(
    actionType: 'VIEW' | 'EDIT' | 'DELETE' | string,
    event: Event
  ): void {
    if (actionType === 'VIEW') {
      this.viewEvent(event.idEvent);
    } else if (actionType === 'EDIT') {
      this.editEvent(event.idEvent);
    } else if (actionType === 'DELETE') {
      this.deleteEvent(event.idEvent);
    } else if (actionType === 'GUESTS') {
      this.router.navigate(['/guests'], {
        queryParams: { eventId: event.idEvent },
      });
    } else if (actionType === 'TASKS') {
      this.router.navigate(['/tasks'], {
        queryParams: { eventId: event.idEvent },
      });
    } else if (actionType === 'STATUS') {
      this.changeEventStatus(event);
    }
  }

  validateEventStatus(): void {
    const today = new Date();

    this.events.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const status = event.status;

      if (
        startDate.toDateString() === today.toDateString() &&
        status === 'CONFIRMED'
      ) {
        this.changeEventStatusByContext(event, 'ONGOING');
      } else if (
        endDate < today &&
        !['FINISHED', 'CANCELLED', 'SUSPENDED', 'POSTPONED'].includes(status)
      ) {
        this.changeEventStatusByContext(event, 'FINISHED');
      }
    });
  }

  changeEventStatusByContext(
    event: Event,
    context: 'ONGOING' | 'FINISHED'
  ): void {
    const statusOptions =
      context === 'ONGOING'
        ? [
            { value: 'IN_PROGRESS' as EventStatus, label: 'En Progreso' },
            { value: 'CANCELLED' as EventStatus, label: 'Cancelado' },
            { value: 'SUSPENDED' as EventStatus, label: 'Suspendido' },
            { value: 'POSTPONED' as EventStatus, label: 'Pospuesto' },
          ]
        : [
            { value: 'CANCELLED' as EventStatus, label: 'Cancelado' },
            { value: 'SUSPENDED' as EventStatus, label: 'Suspendido' },
            { value: 'POSTPONED' as EventStatus, label: 'Pospuesto' },
          ];

    this.alertService
      .selectOption<EventStatus>(
        'Cambiar estado del evento',
        `Seleccione el nuevo estado del evento: ${event.title} con fecha de inicio ${new Date(event.startDate).toLocaleDateString()} y fin ${new Date(event.endDate).toLocaleDateString()}.`,
        statusOptions
      )
      .then((newStatus) => {
        if (!newStatus) return;
        this.eventService.changeStatus(event.idEvent, newStatus).subscribe({
          next: (updated) => {
            this.events = this.events.map((e) =>
              e.idEvent === updated.idEvent ? updated : e
            );
            this.alertService.showSuccessToast(
              'Estado del evento actualizado.'
            );
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al actualizar estado: ${err.error.readableMessage}`
            );
            this.changeEventStatusByContext(event, context);
          },
        });
      });
  }

  changeEventStatus(event: Event): void {
    const statusOptions = [
      { value: 'IN_PROGRESS' as EventStatus, label: 'En Progreso' },
      { value: 'FINISHED' as EventStatus, label: 'Finalizado' },
      { value: 'CANCELLED' as EventStatus, label: 'Cancelado' },
      { value: 'SUSPENDED' as EventStatus, label: 'Suspendido' },
      { value: 'POSTPONED' as EventStatus, label: 'Pospuesto' },
    ];

    this.alertService
      .selectOption<EventStatus>(
        'Cambiar estado del evento',
        `Seleccione el nuevo estado del evento: ${event.title} con fecha de inicio ${new Date(event.startDate).toLocaleDateString()} y fin ${new Date(event.endDate).toLocaleDateString()}.`,
        statusOptions
      )
      .then((newStatus) => {
        if (!newStatus) return;
        this.eventService.changeStatus(event.idEvent, newStatus).subscribe({
          next: (updated) => {
            this.events = this.events.map((e) =>
              e.idEvent === updated.idEvent ? updated : e
            );
            this.alertService.showSuccessToast(
              'Estado del evento actualizado.'
            );
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al actualizar estado: ${err.error.readableMessage}`
            );
          },
        });
      });
  }
}

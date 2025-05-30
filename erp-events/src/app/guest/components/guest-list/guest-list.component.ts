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
import { GuestService } from '../../../services/guest.service';
import { ExportService } from '../../../services/export.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Guest } from '../../../models/guest.model';
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
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { MatSelectModule } from '@angular/material/select';
import { renderIconField } from '../../../utils/render-icon';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    ViewDialogComponent,
    OptionsComponent,
    AgGridAngular,
  ],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.scss',
})
export class GuestListComponent {
  isBrowser: boolean;
  eventId: number | null = null;
  events: Event[] = [];
  guests: Guest[] = [];
  allGuests: Guest[] = [];
  displayedColumns = [
    'idGuest',
    'firstName',
    'lastName',
    'type',
    'email',
    'note',
    'actions',
  ];
  gridApi!: GridApi<Guest>;
  searchValue = '';

  columnDefs: ColDef<Guest>[] = [
    { headerName: 'ID', field: 'idGuest', sortable: true, filter: true },
    { headerName: 'Nombre', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Apellido', field: 'lastName', sortable: true, filter: true },
    {
      headerName: 'Tipo',
      field: 'type',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('guestType'),
    },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Nota', field: 'note', sortable: true, filter: true },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE', guest: Guest) => {
          this.handleAction(action, guest);
        },
      },
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  getRowId = (params: any) => params.data.idGuest;

  onGridReady(params: GridReadyEvent<Guest>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  private guestService = inject(GuestService);
  private exportService = inject(ExportService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
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

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        if (this.eventId) {
          this.guestService.getGuestsFromEvent(this.eventId).subscribe({
            next: (data) => {
              this.guests = data;
              this.allGuests = data;
            },
            error: (err) => {
              console.error('Error al obtener los invitados', err);
              this.alertService.showErrorToast(
                'Error al cargar los invitados.'
              );
            },
          });
        } else {
          this.guestService.getAll().subscribe({
            next: (data) => {
              this.guests = data;
              this.allGuests = data;
            },
            error: (err) => {
              console.error('Error al obtener los invitados', err);
              this.alertService.showErrorToast(
                'Error al cargar los invitados.'
              );
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

  onEventSelected(eventId: number): void {
    if (!eventId) return;
    this.eventId = eventId;
    this.guestService.getGuestsFromEvent(eventId).subscribe({
      next: (guests) => {
        this.guests = guests;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar invitados del evento: ${
            err.error?.message || err.message
          }`
        );
        console.error('Error al cargar invitados del evento:', err);
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
    this.router.navigate(['/guests/create']);
  }

  goToCreateFile(): void {
    this.router.navigate(['/guests/create/file']);
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  goToCheckIn(): void {
    this.router.navigate(['/check-in']);
  }


  viewGuest(id: number): void {
    const guest = this.guests.find((g) => g.idGuest === id);
    if (!guest) return;

    this.dialog.open(ViewDialogComponent, {
      data: guest,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editGuest(idGuest: number, idEvent: number): void {
    this.router.navigate(['/guests/edit', idGuest, idEvent]);
  }

  deleteGuest(id: number): void {
    this.alertService.delete('este invitado').then((confirmed) => {
      if (confirmed) {
        this.guestService.delete(id).subscribe({
          next: () => {
            this.guests = this.guests.filter((g) => g.idGuest !== id);
            this.alertService.showSuccessToast(
              'Invitado eliminado correctamente.'
            );
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar el invitado.');
          },
        });
      }
    });
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.guests,
      'Invitados',
      [['Nombre', 'Apellido', 'Tipo', 'Email', 'Nota']],
      (guest) => [
        guest.firstName,
        guest.lastName,
        guest.type,
        guest.email,
        guest.note || '',
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.guests, 'Invitados', (guest) => ({
      ID: guest.idGuest,
      Nombre: guest.firstName,
      Apellido: guest.lastName,
      Tipo: guest.type,
      Email: guest.email,
      Nota: guest.note || '',
    }));
  }

  handleAction(actionType: 'VIEW' | 'EDIT' | 'DELETE', guest: Guest): void {
    if (actionType === 'VIEW') {
      this.viewGuest(guest.idGuest);
    } else if (actionType === 'EDIT' && this.eventId) {
      this.editGuest(guest.idGuest, this.eventId);
    } else if (actionType === 'DELETE') {
      this.deleteGuest(guest.idGuest);
    }
  }
}

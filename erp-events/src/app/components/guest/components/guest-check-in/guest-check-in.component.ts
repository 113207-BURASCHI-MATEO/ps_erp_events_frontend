import { Component, OnInit, Inject, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridAngular } from '@ag-grid-community/angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  ModuleRegistry,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import { GuestService } from '../../../../services/guest.service';
import { EventService } from '../../../../services/event.service';
import { ExportService } from '../../../../services/export.service';
import { AlertService } from '../../../../services/alert.service';

import { Event } from '../../../../models/event.model';
import { Guest } from '../../../../models/guest.model';
import { GuestAccess } from '../../../../models/guest.model';
import { renderIconField } from '../../../../utils/render-icon';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { toLocalDateTimeString } from '../../../../utils/date';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-check-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AgGridAngular,
    MatButtonModule,
  ],
  templateUrl: './guest-check-in.component.html',
  styleUrl: './guest-check-in.component.scss',
})
export class GuestCheckInComponent implements OnInit {
  private guestService = inject(GuestService);
  private eventService = inject(EventService);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);
  private router = inject(Router)

  isBrowser: boolean;
  selectedEventId: number | null = null;
  events: Event[] = [];
  guests: Guest[] = [];
  searchValue = '';
  gridApi!: GridApi<Guest>;
  displayedColumns = [
    'acreditation.accessType',
    'firstName',
    'lastName',
    'documentNumber',
    'type',
    'acreditation.sector',
    'acreditation.rowTable',
    'acreditation.seat',
    'phoneNumber',
    'acreditation.foodRestriction',
    'acreditation.foodDescription',
    'note',
    'actions',
  ];

  columnDefs: ColDef<Guest>[] = [
    {
      headerName: 'Ingreso',
      field: 'acreditation.accessType',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('accessType'),
    },
    { headerName: 'Nombre', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Apellido', field: 'lastName', sortable: true, filter: true },
    {
      headerName: 'Documento',
      field: 'documentNumber',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Tipo',
      field: 'type',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('guestType'),
    },
    { headerName: 'Sector', field: 'acreditation.sector', sortable: true, filter: true },
    { headerName: 'Mesa/Fila', field: 'acreditation.rowTable', sortable: true, filter: true },
    { headerName: 'Asiento', field: 'acreditation.seat', sortable: true, filter: true },
    { headerName: 'Telefono', field: 'phoneNumber', sortable: true, filter: true },
    {
      headerName: 'Restriccion',
      field: 'acreditation.foodRestriction',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('foodRestriction'),
    },
    { headerName: 'Descripcion', field: 'acreditation.foodDescription', sortable: true, filter: true },
    { headerName: 'Nota', field: 'note', sortable: true, filter: true },
    {
      headerName: 'Check-in',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'CHECK-IN' | 'CHECK-OUT', guest: Guest) => {
          this.handleAction(action, guest);
        },
        actions: [
          { label: 'Check-In', icon: 'check_box', action: 'CHECK-IN' },
          { label: 'Check-Out', icon: 'indeterminate_check_box', action: 'CHECK-OUT' },
        ],
      },
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.loadEvents();
  }

  onGridReady(event: GridReadyEvent<Guest>): void {
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
      const width = window.innerWidth;
      const showColumns =
        width < 768
          ? ['firstName', 'lastName', 'actions']
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
      next: (data) => (this.events = data),
      error: () => this.alertService.showErrorToast('Error al cargar eventos'),
    });
  }

  onEventSelected(eventId: number): void {
    this.selectedEventId = eventId;
    this.guestService.getGuestsFromEvent(eventId).subscribe({
      next: (data) => {
        console.log('Invitados cargados:', data);
        this.guests = data},
      error: () =>
        this.alertService.showErrorToast(
          'Error al cargar invitados del evento'
        ),
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

  registerEntry(guest: Guest): void {
    if (!this.selectedEventId) return;

    const access: GuestAccess = {
      idGuest: guest.idGuest,
      idEvent: this.selectedEventId,
      accessType: guest.acreditation.accessType === 'ENTRY' ? 'EXIT' : 'ENTRY',
      actionDate: toLocalDateTimeString(new Date()),
    };

    this.guestService.registerAccess(access).subscribe({
      next: (guest) => {
        this.guests = this.guests.map((g) => g.idGuest === guest.idGuest ? guest : g);
        this.alertService.showSuccessToast(
          `Entrada registrada para ${guest.firstName} ${guest.lastName}`
        );
      },
      error: () =>
        this.alertService.showErrorToast('Error al registrar el acceso'),
    });
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.guests,
      'Check-in de Invitados',
      [['Nombre', 'Apellido', 'Tipo', 'Documento', 'Sector', 'Mesa/Fila', 'Asiento', 'Restriccion', 'Descripcion', 'Nota', "Ingreso"]],
      (g) => [
        g.firstName,
        g.lastName,
        g.type,
        g.documentNumber,
        g.acreditation?.sector || '-',
        g.acreditation?.rowTable || '-',
        g.acreditation?.seat?.toString() || '-',
        g.acreditation?.foodRestriction ? 'Si' : 'No',
        g.acreditation?.foodDescription || '',
        g.note || '',
        '[ ]' // checkbox
      ]
    );
  }
  
  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.guests,
      'Check-in de Invitados',
      (g) => ({
        Nombre: g.firstName,
        Apellido: g.lastName,
        Tipo: g.type,
        Documento: g.documentNumber,
        Sector: g.acreditation?.sector || '',
        'Mesa/Fila': g.acreditation?.rowTable || '',
        Asiento: g.acreditation?.seat ?? '',
        Restriccion: g.acreditation?.foodRestriction ? 'Si' : 'No',
        Descripcion: g.acreditation?.foodDescription || '',
        Nota: g.note || '',
        Ingreso: '' // checkbox
      })
    );
  }
  

  handleAction(actionType: 'CHECK-IN' | 'CHECK-OUT', guest: Guest): void {
    if (actionType === 'CHECK-IN' && (guest.acreditation.accessType === 'EXIT' || !guest.acreditation.accessType)) {
      this.registerEntry(guest)
    } else if (actionType === 'CHECK-OUT' && guest.acreditation.accessType === 'ENTRY') {
      this.registerEntry(guest)
    } else {
      this.alertService.showErrorToast('Acción no válida para el estado actual del invitado');
    }
  }

  goBack(): void {
    this.router.navigate(['/guests']);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { ExportService } from '../../../../services/export.service';
import { AlertService } from '../../../../services/alert.service';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/client.model';

import type { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-client-list',
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
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent implements OnInit {
  isBrowser: boolean;

  clients: Client[] = [];
  allClients: Client[] = [];
  searchValue: string = '';
  gridApi!: GridApi<Client>;
  displayedColumns = [
    'idClient',
    'firstName',
    'lastName',
    'documentType',
    'documentNumber',
    'email',
    'phoneNumber',
    'actions',
  ];

  columnDefs: ColDef<Client>[] = [
    //{ headerName: 'ID', field: 'idClient', sortable: true, filter: true },
    { headerName: 'Nombre', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Apellido', field: 'lastName', sortable: true, filter: true },
    //{ headerName: 'Tipo Doc', field: 'documentType', sortable: true, filter: true },
    //{ headerName: 'Doc Nº', field: 'documentNumber', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Teléfono', field: 'phoneNumber', sortable: true, filter: true },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (
          action: 'VIEW' | 'EDIT' | 'DELETE' | 'PDF',
          client: Client
        ) => {
          this.handleAction(action, client);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Editar', icon: 'edit', action: 'EDIT' },
          { label: 'Archivos', icon: 'picture_as_pdf', action: 'PDF' },
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

  getRowId = (params: any) => params.data.idClient;

  private clientService = inject(ClientService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.allClients = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar clientes: ${err.error.readableMessage}`
        );
      },
    });
  }

  onGridReady(params: GridReadyEvent<Client>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
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

  onSearch(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'quickFilterText',
        this.searchValue.trim().toLowerCase()
      );
    }
  }

  goToCreate(): void {
    this.router.navigate(['/clients/create']);
  }

  viewClient(id: number): void {
    const client = this.clients.find((c) => c.idClient === id);
    if (!client) return;

    this.dialog.open(ViewDialogComponent, {
      data: client,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editClient(id: number): void {
    this.router.navigate(['/clients/edit', id]);
  }

  deleteClient(id: number): void {
    this.alertService.delete('este cliente').then((confirmed) => {
      if (confirmed) {
        this.clientService.delete(id).subscribe({
          next: () => {
            this.clients = this.clients.filter((c) => c.idClient !== id);
            this.alertService.showSuccessToast('Cliente eliminado correctamente.');
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al eliminar cliente: ${err.error.readableMessage}`
            );
          },
        });
      }
    });
  }

  renderFile(client: Client): void {
    this.router.navigate(['/files/entity', 'client', client.idClient]);
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.clients,
      'Clientes',
      [['Nombre', 'Apellido', 'Documento', 'Email', 'Teléfono']],
      (cli) => [
        cli.firstName,
        cli.lastName,
        `${cli.documentType}: ${cli.documentNumber}`,
        cli.email,
        cli.phoneNumber,
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.clients, 'Clientes', (cli) => ({
      ID: cli.idClient,
      Nombre: cli.firstName,
      Apellido: cli.lastName,
      'Tipo de Documento': cli.documentType,
      'Número de Documento': cli.documentNumber,
      Email: cli.email,
      Teléfono: cli.phoneNumber,
      'Alias o CBU': cli.aliasCbu,
      Creación: cli.creationDate,
      Actualización: cli.updateDate,
      'Baja lógica': cli.softDelete ? 'Sí' : 'No',
    }));
  }

  handleAction(
    actionType: 'VIEW' | 'EDIT' | 'DELETE' | 'PDF',
    client: Client
  ): void {
    if (actionType === 'VIEW') {
      this.viewClient(client.idClient);
    } else if (actionType === 'EDIT') {
      this.editClient(client.idClient);
    } else if (actionType === 'DELETE') {
      this.deleteClient(client.idClient);
    } else if (actionType === 'PDF') {
      this.renderFile(client);
    }
  }
}

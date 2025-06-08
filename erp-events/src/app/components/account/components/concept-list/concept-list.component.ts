import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { ExportService } from '../../../../services/export.service';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../../services/alert.service';
import { ConceptService } from '../../../../services/concept.service';
import { Account, Concept } from '../../../../models/account.model';

import type { ColDef, GridApi, GridReadyEvent, GridSizeChangedEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { PLATFORM_ID } from '@angular/core';
import { renderIconField } from '../../../../utils/render-icon';
import { AccountService } from '../../../../services/account.service';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-concept-list',
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
    CurrencyPipe
  ],
  templateUrl: './concept-list.component.html',
  styleUrl: './concept-list.component.scss',
})
export class ConceptListComponent implements OnInit {
  isBrowser: boolean;

  concepts: Concept[] = [];
  account: Account | null = null;
  allConcepts: Concept[] = [];
  searchValue: string = '';
  gridApi!: GridApi<Concept>;
  accountId: number | null = null;
  displayedColumns = [
    'accountingDate',
    'concept',
    'comments',
    'amount',
    'actions',
  ];

  columnDefs: ColDef<Concept>[] = [
    {
      headerName: 'Fecha',
      field: 'accountingDate',
      sortable: true,
      filter: true,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('es-AR'),
    },
    {
      headerName: 'Concepto',
      field: 'concept',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('accountingConcept'),
    },
    {
      headerName: 'Comentarios',
      field: 'comments',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Monto',
      field: 'amount',
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => {
        const value = params.value;
        const formatted = value.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const className = value >= 0 ? 'text-success' : 'text-danger';
        return `<span class="${className} fw-bold">${formatted}</span>`;
      },
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (
          action: 'VIEW' | 'EDIT' | 'DELETE' | 'PDF',
          concept: Concept
        ) => {
          this.handleAction(action, concept);
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

  getRowId = (params: any) => params.data.idConcept;

  private conceptService = inject(ConceptService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private fileService = inject(FileService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.accountId = +idParam;
        this.loadAccountConcepts(this.accountId);
      } else {
        this.loadConcepts();
      }
    });
  }

  loadAccountConcepts(id: number) {
    this.conceptService.getByAccountId(id).subscribe({
      next: (data: Concept[]) => {
        this.concepts = data;
        this.allConcepts = data;
        this.accountService.getById(id).subscribe({
          next: (data: Account) => {
            this.account = data;
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al cargar la cuenta: ${err.error.readableMessage}`
            );
          },
        });
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar conceptos: ${err.error.readableMessage}`);
      },
    });
  }

  loadConcepts() {
    this.conceptService.getAll().subscribe({
      next: (data) => {
        this.concepts = data;
        this.allConcepts = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar conceptos: ${err.error.readableMessage}`
        );
      },
    });
  }

  onGridReady(params: GridReadyEvent<Concept>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  onGridSizeChanged(params: GridSizeChangedEvent): void {
      const width = window.innerWidth;
      const showColumns =
        width < 768
          ? ['concept', 'amount', 'actions']
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
    this.router.navigate(['events/account', this.accountId, 'concepts', 'create']);
  }

  viewConcept(id: number): void {
    const concept = this.concepts.find((c) => c.idConcept === id);
    if (!concept) return;

    this.dialog.open(ViewDialogComponent, {
      data: concept,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editConcept(id: number): void {
    this.router.navigate(['events/account', this.accountId, 'concepts', 'edit', id]);
  }

  deleteConcept(id: number): void {
    this.alertService.delete('este concepto').then((confirmed) => {
      if (confirmed) {
        this.conceptService.delete(id).subscribe({
          next: () => {
            this.concepts = this.concepts.filter((c) => c.idConcept !== id);
            this.alertService.showSuccessToast(
              'Concepto eliminado correctamente.'
            );
          },
          error: (err) => {
            this.alertService.showErrorToast(
              `Error al eliminar concepto: ${err.error.readableMessage}`
            );
          },
        });
      }
    });
  }

  renderFile(concept: Concept): void {
    if (concept.idFile) {
      this.fileService.getFileById(concept.idFile).subscribe({
        next: (blob: Blob) => {
          const blobWithType = new Blob([blob], { type: concept.fileContentType });
          const url = window.URL.createObjectURL(blobWithType);
          window.open(url, '_blank');
        },
        error: (err) => {
          this.alertService.showErrorToast('Error al descargar el archivo');
          console.error('Error al descargar archivo:', err);
        },
      }); 
    } else {
      this.alertService.showErrorToast("El concepto no tiene un archivo asociado");
    }
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.concepts,
      'Conceptos',
      [['Cuenta', 'Fecha', 'Concepto', 'Monto']],
      (c) => [
        c.idAccount,
        new Date(c.accountingDate).toLocaleDateString('es-AR'),
        c.concept,
        c.amount,
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.concepts, 'Conceptos', (c) => ({
      ID: c.idConcept,
      Cuenta: c.idAccount,
      Fecha: c.accountingDate,
      Concepto: c.concept,
      Comentarios: c.comments,
      Monto: c.amount,
      Archivo: c.idFile ?? 'N/A',
      Creación: c.creationDate,
      Actualización: c.updateDate,
      'Baja lógica': c.softDelete ? 'Sí' : 'No',
    }));
  }

  handleAction(
    actionType: 'VIEW' | 'EDIT' | 'DELETE' | 'PDF',
    concept: Concept
  ): void {
    if (actionType === 'VIEW') {
      this.viewConcept(concept.idConcept);
    } else if (actionType === 'EDIT') {
      this.editConcept(concept.idConcept);
    } else if (actionType === 'DELETE') {
      this.deleteConcept(concept.idConcept);
    } else if (actionType === 'PDF') {
      this.renderFile(concept);
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}

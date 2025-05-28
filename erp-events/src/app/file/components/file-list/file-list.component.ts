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
import { ExportService } from '../../../services/export.service';
import { File } from '../../../models/file.model';
import { OptionsComponent } from '../../../shared/components/options/options.component';
import { FileService } from '../../../services/file.service';

import type { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../services/alert.service';
import { renderIconField } from '../../../utils/render-icon';

@Component({
  selector: 'app-file-list',
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
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
})
export class FileListComponent implements OnInit {
  isBrowser: boolean;
  files: File[] = [];
  allFiles: File[] = [];
  gridApi!: GridApi<File>;
  searchValue: string = '';

  columnDefs: ColDef<File>[] = [
    { headerName: 'ID', field: 'idFile', sortable: true, filter: true },
    { headerName: 'Nombre', field: 'fileName', sortable: true, filter: true },
    {
      headerName: 'Tipo',
      field: 'fileType',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('fileType'),
    },
    {
      headerName: 'Contenido',
      field: 'fileContentType',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('fileContentType'),
    },
    {
      headerName: 'Fecha Creación',
      field: 'creationDate',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW' | 'EDIT' | 'DELETE', file: File) => {
          this.handleAction(action, file);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Editar', icon: 'edit', action: 'EDIT' },
          { label: 'Archivo', icon: 'picture_as_pdf', action: 'PDF' },
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

  getRowId = (params: any) => params.data.idFile;

  onGridReady(params: GridReadyEvent<File>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  private fileService = inject(FileService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getAll().subscribe({
      next: (data) => {
        console.log('Archivos cargados:', data);
        this.files = data;
        this.allFiles = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar archivos: ${err.error?.message || err.message}`
        );
        console.error('Error al cargar archivos:', err);
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
    this.router.navigate(['/files/create']);
  }

  viewFile(id: number): void {
    const file = this.files.find((f) => f.idFile === id);
    if (!file) return;

    this.dialog.open(ViewDialogComponent, {
      data: file,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  editFile(id: number): void {
    this.router.navigate(['/files/edit', id]);
  }

  deleteFile(id: number): void {
    this.alertService.delete('este archivo').then((confirmed) => {
      if (confirmed) {
        this.fileService.delete(id).subscribe({
          next: () => {
            this.files = this.files.filter((f) => f.idFile !== id);
            this.alertService.showSuccessToast(
              'Archivo eliminado correctamente.'
            );
          },
          error: () => {
            this.alertService.showErrorToast('Error al eliminar el archivo.');
          },
        });
      }
    });
  }

  renderFile(file: File): void {
    this.fileService.getFileById(file.idFile).subscribe({
      next: (blob: Blob) => {
        const blobWithType = new Blob([blob], { type: file.fileContentType });
        const url = window.URL.createObjectURL(blobWithType);
        window.open(url, '_blank');
      },
      error: (err) => {
        this.alertService.showErrorToast('Error al descargar el archivo');
        console.error('Error al descargar archivo:', err);
      },
    });
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.files,
      'Archivos',
      [['Nombre', 'Tipo', 'Tipo de Contenido', 'Fecha de Creación']],
      (file) => [
        file.fileName,
        file.fileType,
        file.fileContentType,
        file.creationDate,
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.files, 'Archivos', (file) => ({
      ID: file.idFile,
      Nombre: file.fileName,
      Tipo: file.fileType,
      Contenido: file.fileContentType,
      'Fecha Creación': file.creationDate,
    }));
  }

  handleAction(actionType: 'VIEW' | 'EDIT' | 'DELETE', file: File): void {
    if (actionType === 'VIEW') {
      this.viewFile(file.idFile);
    } else if (actionType === 'EDIT') {
      this.editFile(file.idFile);
    } else if (actionType === 'DELETE') {
      this.deleteFile(file.idFile);
    } else if (actionType === 'PDF') {
      this.renderFile(file);
    }
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }
}

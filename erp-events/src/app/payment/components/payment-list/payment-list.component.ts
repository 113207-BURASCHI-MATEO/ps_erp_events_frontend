import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { ExportService } from '../../../services/export.service';

import type { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewDialogComponent } from '../../../shared/components/view-dialog/view-dialog.component';
import { AlertService } from '../../../services/alert.service';
import { Payment } from '../../../models/payment.model';
import { PaymentService } from '../../../services/payment.service';
import { renderIconField } from '../../../utils/render-icon';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-payment-list',
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
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
})
export class PaymentListComponent implements OnInit {
  isBrowser: boolean;

  payments: Payment[] = [];
  allPayments: Payment[] = [];
  searchValue: string = '';
  gridApi!: GridApi<Payment>;

  columnDefs: ColDef<Payment>[] = [
    { headerName: 'ID', field: 'idPayment', sortable: true, filter: true },
    {
      headerName: 'Fecha de Pago',
      field: 'paymentDate',
      sortable: true,
      filter: true,
      valueFormatter: params => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('es-AR');
      }
    },
    {
      headerName: 'ID Cliente',
      field: 'idClient',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Importe',
      field: 'amount',
      sortable: true,
      filter: true,
      valueFormatter: (params) => `$${params.value}`,
    },
    { headerName: 'Detalle', field: 'detail', sortable: true, filter: true },
    {
      headerName: 'Estado',
      field: 'status',
      sortable: true,
      filter: true,
      cellRenderer: renderIconField('paymentStatus'),
    },
    {
      headerName: 'Acciones',
      cellRenderer: OptionsComponent,
      cellRendererParams: {
        onClick: (action: 'VIEW', payment: Payment) => {
          this.handleAction(action, payment);
        },
        actions: [
          { label: 'Ver', icon: 'visibility', action: 'VIEW' },
          { label: 'Cliente', icon: 'person', action: 'CLIENT' },
          { label: 'Estado', icon: 'currency_exchange', action: 'STATUS' },
        ],
      },
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  getRowId = (params: any) => params.data.idPayment;

  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private exportService = inject(ExportService);
  private alertService = inject(AlertService);
  private clientService = inject(ClientService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.payments = data;
        this.allPayments = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar pagos: ${err.error.message}`
        );
        console.error('Error al cargar pagos', err.error.message);
      },
    });
  }

  onGridReady(params: GridReadyEvent<Payment>): void {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
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
    this.router.navigate(['/payments/create']);
  }

  viewPayment(id: number): void {
    const payment = this.payments.find((p) => p.idPayment === id);
    if (!payment) return;

    this.dialog.open(ViewDialogComponent, {
      data: payment,
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  viewClient(id: number): void {
    this.clientService.getById(id).subscribe({
      next: (client) => {
        this.dialog.open(ViewDialogComponent, {
          data: client,
          width: '600px',
          maxWidth: '95vw',
          maxHeight: '95vh',
        });
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar cliente: ${err.error.message}`
        );
        console.error('Error al cargar cliente', err.error.message);
      },
    });
  }

  changePaymentStatus(payment: Payment): void {
    if (payment.status === 'PAID') {
      this.alertService.showErrorToast(
        'No se puede cambiar el estado de un pago que ya fue COBRADO.'
      );
      return;
    }
    this.paymentService.updateStatus(payment.idPayment, 'PAID').subscribe({
      next: (updatedPayment) => {
        console.log('Estado actualizado', updatedPayment);
        this.payments = this.payments.map((p) =>
          p.idPayment === payment.idPayment ? updatedPayment : p
        );
        this.alertService.showSuccessToast('Estado actualizado correctamente');
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al actualizar estado: ${err.error.message}`
        );
        console.error('Error al actualizar estado', err.error.message);
      },
    });
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.payments,
      'Pagos',
      [['Fecha', 'Cliente', 'Importe', 'Detalle', 'Estado']],
      (p) => [
        p.paymentDate,
        p.idClient,
        p.amount.toFixed(2),
        p.detail || '',
        p.status,
      ]
    );
  }

  exportToExcel(): void {
    this.exportService.exportToExcel(this.payments, 'Pagos', (p) => ({
      ID: p.idPayment,
      'Fecha de Pago': p.paymentDate,
      'ID Cliente': p.idClient,
      Importe: p.amount,
      Detalle: p.detail || '',
      Estado: p.status,
      Nota: p.reviewNote,
    }));
  }

  handleAction(actionType: 'VIEW' | 'CLIENT', payment: Payment): void {
    if (actionType === 'VIEW') {
      this.viewPayment(payment.idPayment);
    } else if (actionType === 'CLIENT') {
      this.viewClient(payment.idClient);
    } else if (actionType === 'STATUS') {
      this.changePaymentStatus(payment);
    }
  }
}

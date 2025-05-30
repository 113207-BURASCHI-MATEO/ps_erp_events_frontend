import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { PaymentService } from '../../../services/payment.service';
import {
  Payment,
  PaymentPost,
  PaymentStatus,
} from '../../../models/payment.model';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
})
export class PaymentFormComponent {
  form: FormGroup;
  paymentId: number | null = null;
  clients: Client[] = [];

  private fb = inject(FormBuilder);
  private service = inject(PaymentService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private clientService = inject(ClientService);

  statusOptions: PaymentStatus[] = ['PAID', 'PENDING_PAYMENT'];

  constructor() {
    this.form = this.fb.group({
      paymentDate: new FormControl('', [Validators.required]),
      idClient: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
      detail: new FormControl(''),
      status: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al cargar clientes: ${err.error.message}`
        );
        console.error('Error al cargar clientes:', err.error.message);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const dataBase: PaymentPost = {
      ...formValue,
      paymentDate: formValue.paymentDate, // ya es Date, Angular lo convierte
    };

    this.service.create(dataBase).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Pago creado correctamente.');
        this.router.navigate(['/payments']);
      },
      error: (err) => {
        this.alertService.showErrorToast(
          `Error al crear pago: ${err.error.message}`
        );
        console.error('Error al crear pago:', err.error.message);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }
}

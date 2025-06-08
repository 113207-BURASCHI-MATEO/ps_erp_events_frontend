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
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { ClientService } from '../../../../services/client.service';
import { Client, ClientPost, ClientPut } from '../../../../models/client.model';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormFieldErrorComponent
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent {
  form: FormGroup;
  clientId: number | null = null;

  private fb = inject(FormBuilder);
  private service = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  constructor() {
    this.form = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      documentType: new FormControl('', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(?=(?:.*\d){10,})\+?[0-9\s-]+$/)]),
      aliasCbu: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam;
        this.loadClient(this.clientId);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.clientId) {
      const dataPut: ClientPut = { idClient: this.clientId, ...formValue };
      this.service.update(this.clientId, dataPut).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Cliente actualizado correctamente.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al actualizar cliente: ${err.error.readableMessage}`);
        },
      });
    } else {
      const dataPost: ClientPost = formValue;
      this.service.create(dataPost).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Cliente creado correctamente.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al crear cliente: ${err.error.readableMessage}`);
        },
      });
    }
  }

  loadClient(id: number): void {
    this.service.getById(id).subscribe({
      next: (client: Client) => {
        this.form.patchValue({ ...client });
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar cliente: ${err.error.readableMessage}`);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GuestPost, GuestType } from '../../../models/guest.model';
import { Event as EventModel } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { AlertService } from '../../../services/alert.service';
import { GuestService } from '../../../services/guest.service';
import { DocumentType } from '../../../models/generic.model';
import { toLocalDateTimeString } from '../../../utils/date';

@Component({
  selector: 'app-guest-file',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './guest-file.component.html',
  styleUrl: './guest-file.component.scss'
})
export class GuestFileComponent {
  form: FormGroup;
  events: EventModel[] = [];
  guestTypeOptions: GuestType[] = ['VIP', 'REGULAR', 'STAFF', 'FAMILY', 'FRIEND', 'OTHER', 'GENERAL'];
  uploadedGuests: GuestPost[] = [];


  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private alertService = inject(AlertService);
  private guestService = inject(GuestService);
  private router = inject(Router);
  constructor(
  ) {
    this.form = this.fb.group({
      idEvent: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar eventos: ${err.error.readableMessage}`);
      },
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      this.parseCsvFile(file);
    }
  }

  parseCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const rows = content.split('\n').map(r => r.trim()).filter(r => r);

      if (!rows.length) return;

      const header = rows[0].split(',').map(h => h.trim().toLowerCase());
      const expectedHeaders = ['nombre', 'apellido', 'tipo', 'email', 'telefono', 'tipo_doc', 'documento', 'nacimiento', 'nota', 'sector', 'asiento', 'fila_mesa'];

      const isValidHeader = expectedHeaders.every(h => header.includes(h));
      if (!isValidHeader) {
        this.alertService.showErrorToast('El archivo CSV no contiene las columnas requeridas: nombre, apellido, tipo, email, nota, tipo doc, documento, nacimiento, sector, asiento, fila mesa.');
        return;
      }

      const nameIndex = header.indexOf('nombre');
      const lastNameIndex = header.indexOf('apellido');
      const typeIndex = header.indexOf('tipo');
      const emailIndex = header.indexOf('email');
      const phoneIndex = header.indexOf('telefono');
      const noteIndex = header.indexOf('nota');
      const documentIndex = header.indexOf('documento');
      const birthIndex = header.indexOf('nacimiento');
      const docTypeIndex = header.indexOf('tipo_doc');
      const sectorIndex = header.indexOf('sector');
      const seatIndex = header.indexOf('asiento');
      const rowTableIndex = header.indexOf('fila_mesa');

      const guests: GuestPost[] = rows.slice(1).map(line => {
        const cols = line.split(',').map(c => c.trim());
        return {
          firstName: cols[nameIndex],
          lastName: cols[lastNameIndex],
          type: cols[typeIndex] as GuestType,
          email: cols[emailIndex],
          phoneNumber: cols[phoneIndex] || '',
          note: cols[noteIndex] || '',
          documentNumber: cols[documentIndex] || '',
          birthDate: cols[birthIndex] ? toLocalDateTimeString(new Date(cols[birthIndex])) : '',
          documentType: cols[docTypeIndex] as DocumentType || '',
          idEvent: this.form.value.idEvent,
          sector: cols[sectorIndex] || '',
          seat: cols[seatIndex] ? parseInt(cols[seatIndex], 10) : 0,
          rowTable: cols[rowTableIndex] || ''

        };
      });

      this.uploadedGuests = guests;
      console.log('Invitados cargados:', this.uploadedGuests);
      this.alertService.showSuccessToast('El archivo a sido procesado correctamente. Puedes proceder a cargar los invitados.');
    };

    reader.readAsText(file);
  }

  onSubmit(): void {
    if (this.form.invalid || this.uploadedGuests.length === 0) return;

    const idEvent = this.form.value.idEvent;

    this.guestService.saveGuestsToEvent(idEvent, this.uploadedGuests).subscribe({
      next: () => {
        this.alertService.showSuccessToast('Invitados cargados exitosamente.');
        this.router.navigate(['/guests']);
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar invitados: ${err.error.readableMessage}`);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/guests']);
  }
}

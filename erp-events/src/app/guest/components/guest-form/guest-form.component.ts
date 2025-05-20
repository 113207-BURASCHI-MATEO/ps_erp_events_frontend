import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { GuestService } from '../../../services/guest.service';
import { Guest, GuestPost, GuestPut, GuestType } from '../../../models/guest.model';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-guest-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.scss'
})
export class GuestFormComponent {
  form: FormGroup;
  guestId: number | null = null;
  eventId: number | null = null;
  events: Event[] = [];

  guestTypeOptions: GuestType[] = ['VIP', 'REGULAR', 'STAFF', 'FAMILY', 'FRIEND', 'OTHER', 'GENERAL'];

  constructor(
    private fb: FormBuilder,
    private service: GuestService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private eventService: EventService
  ) {
    this.form = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      note: new FormControl(''),
      idEvent: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idGuestParam = params.get('idGuest');
      const idEventParam = params.get('idEvent');

      if (idGuestParam) {
        this.guestId = +idGuestParam;
        this.loadGuest(this.guestId);
      }
      if (idEventParam) {
        this.eventId = +idEventParam;
        this.form.patchValue({ idEvent: +idEventParam });
        this.form.get('idEvent')?.disable();
      }
    });
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar eventos: ${err.error?.message || err.message}`);
        console.error('Error al cargar eventos:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.guestId && this.eventId) {
      const dataPut: GuestPut = { idGuest: this.guestId, ...formValue };
      dataPut.idEvent = this.eventId;
      this.service.update(this.guestId, dataPut).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Invitado actualizado correctamente.');
          this.router.navigate(['/guests']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al actualizar invitado: ${err.error.message}`);
          console.error('Error al actualizar invitado:', err.error.message);
        },
      });
    } else {
      const dataPost: GuestPost = formValue;
      this.service.create(dataPost).subscribe({
        next: () => {
          this.alertService.showSuccessToast('Invitado creado correctamente.');
          this.router.navigate(['/guests']);
        },
        error: (err) => {
          this.alertService.showErrorToast(`Error al crear invitado: ${err.error.message}`);
          console.error('Error al crear invitado:', err.error.message);
        },
      });
    }
  }

  loadGuest(id: number): void {
    this.service.getById(id).subscribe({
      next: (guest: Guest) => {
        console.log('Invitado cargado:', guest);
        this.form.patchValue(guest);
      },
      error: (err) => {
        this.alertService.showErrorToast(`Error al cargar invitado: ${err.error.message}`);
        console.error('Error al cargar invitado', err.error.message);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/guests']);
  }
}

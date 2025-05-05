import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, EventPost, EventPut } from '../../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent {
  form: FormGroup;
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      clientId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEvent(this.eventId);
      }
    });
  }

  loadEvent(id: number): void {
    this.eventService.getById(id).subscribe({
      next: (event: Event) => {
        this.form.patchValue({
          ...event,
          startDate: event.startDate,
          endDate: event.endDate,
          clientId: event.client?.idClient,
        });
      },
      error: (err) => console.error('Error al cargar evento', err),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const baseData = {
      ...formValue,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
    };

    if (this.eventId) {
      const dataPut: EventPut = {
        idEvent: this.eventId,
        ...baseData,
      };
      this.eventService.update(this.eventId, dataPut).subscribe({
        next: () => this.router.navigate(['/events']),
        error: (err) => {
          alert('Error al actualizar evento: ' + err.message);
          console.error(err);
        },
      });
    } else {
      const dataPost: EventPost = baseData;
      this.eventService.create(dataPost).subscribe({
        next: () => this.router.navigate(['/events']),
        error: (err) => {
          alert('Error al crear evento: ' + err.message);
          console.error(err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}

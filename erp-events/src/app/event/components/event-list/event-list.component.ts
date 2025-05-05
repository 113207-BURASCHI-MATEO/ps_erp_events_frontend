import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventService } from '../../../services/event.service';
import { ExportService } from '../../../services/export.service';
import { Router } from '@angular/router';
import { Event } from '../../../models/event.model';
import { MatDialog } from '@angular/material/dialog';
import { EventViewDialogComponent } from '../event-view-dialog/event-view-dialog.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    EventViewDialogComponent
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {

  events: Event[] = [];
  allEvents: Event[] = [];
  displayedColumns = ['idEvent', 'title', 'description', 'eventType', 'startDate', 'endDate', 'status', 'actions'];
  searchValue = '';

  constructor(
    private eventService: EventService,
    private exportService: ExportService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.allEvents = data;
      },
      error: (err) => console.error('Error al cargar eventos', err)
    });
  }

  onSearch(): void {
    const value = this.searchValue.trim().toLowerCase();
    if (!value) {
      this.events = this.allEvents;
      return;
    }

    this.events = this.allEvents.filter(evt =>
      evt.title.toLowerCase().includes(value) ||
      evt.description.toLowerCase().includes(value) ||
      evt.status.toLowerCase().includes(value)
    );
  }

  goToCreate(): void {
    this.router.navigate(['/events/create']);
  }

  goHome(): void {
    this.router.navigate(['/landing']);
  }

  viewEvent(id: number): void {
    const evento = this.events.find(e => e.idEvent === id);
    if (!evento) return;
  
    this.dialog.open(EventViewDialogComponent, {
      data: evento,
      width: '600px',
      maxWidth: '95vw'
    });
  }
  

  editEvent(id: number): void {
    this.router.navigate(['/events/edit', id]);
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro que deseas eliminar este evento?')) {
      this.eventService.delete(id).subscribe({
        next: () => this.events = this.events.filter(e => e.idEvent !== id),
        error: (err) => console.error('Error al eliminar evento', err)
      });
    }
  }

  exportToPdf(): void {
    this.exportService.exportToPdf(
      this.events,
      'Eventos',
      [['Título', 'Tipo', 'Estado', 'Inicio', 'Fin']],
      event => [
        event.title,
        event.eventType,
        event.status,
        this.formatDate(event.startDate),
        this.formatDate(event.endDate)
      ]
    );
  }
  

  exportToExcel(): void {
    this.exportService.exportToExcel(
      this.events,
      'Eventos',
      event => ({
        Título: event.title,
        Tipo: event.eventType,
        Estado: event.status,
        Inicio: this.formatDate(event.startDate),
        Fin: this.formatDate(event.endDate)
      })
    );
  }

  private formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }
  
}

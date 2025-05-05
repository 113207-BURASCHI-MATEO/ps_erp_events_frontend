import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './event-view-dialog.component.html',
  styleUrl: './event-view-dialog.component.css'
})
export class EventViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public event: Event) {}
}

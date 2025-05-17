import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Notification } from '../../../models/notification.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,  ],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss',
})
export class NotificationDialogComponent {
  notification: Notification;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Notification) {
    this.notification = data;
    this.notification.body = this.extractBodyContent(this.notification.body);
  }

  extractBodyContent(html: string): string {
    const bodyStart = html.indexOf('<body>');
    const bodyEnd = html.indexOf('</body>');
    if (bodyStart === -1 || bodyEnd === -1) return html;
    return html.substring(bodyStart + 6, bodyEnd).trim();
  }
}

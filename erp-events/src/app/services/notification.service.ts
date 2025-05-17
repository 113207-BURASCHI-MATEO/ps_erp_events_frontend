import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification, NotificationPost } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.notifications}`
      : `${environment.apis.notifications}`
  }`;

  constructor(private http: HttpClient) {}

  getNotifications(idUser: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${idUser}`, { withCredentials: true });
  }

  sendToContacts(notification: NotificationPost): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/send-to-contacts`,
      notification,
      { withCredentials: true }
    );
  }

  markAsRead(idNotification: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${idNotification}`,
      null,
      { withCredentials: true }
    );
  }
}

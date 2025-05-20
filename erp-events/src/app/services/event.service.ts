import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event, EventPost, EventPut } from '../models/event.model';
import { environment } from '../../environments/environment';
import { GuestPost } from '../models/guest.model';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.events}`
      : `${environment.apis.events}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as Event[]));
  }

  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(event: EventPost): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event, {
      withCredentials: true,
    });
  }

  update(id: number, event: EventPut): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

}

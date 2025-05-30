import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Guest, GuestAccess, GuestPost, GuestPut } from '../models/guest.model';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.guests}`
      : `${environment.apis.guests}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Guest[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as Guest[]));
  }

  getById(id: number): Observable<Guest> {
    return this.http.get<Guest>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(location: GuestPost): Observable<Guest> {
    return this.http.post<Guest>(this.baseUrl, location, {
      withCredentials: true,
    });
  }

  update(id: number, location: GuestPut): Observable<Guest> {
    return this.http.put<Guest>(`${this.baseUrl}/${id}`, location, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  saveGuestsToEvent(idEvent: number, guests: GuestPost[]): Observable<Guest[]> {
    return this.http.post<Guest[]>(`${this.baseUrl}/event/${idEvent}`, guests, {
      withCredentials: true,
    });
  }

  getGuestsFromEvent(idEvent: number): Observable<Guest[]> {
    return this.http
      .get<Guest[]>(`${this.baseUrl}/event/${idEvent}`, { withCredentials: true });
  }

  registerAccess(data: GuestAccess): Observable<Guest> {
    return this.http.post<Guest>(`${this.baseUrl}/access`, data, { withCredentials: true });
  }
}

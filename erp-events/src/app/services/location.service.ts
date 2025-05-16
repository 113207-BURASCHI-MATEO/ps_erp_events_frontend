import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Location, LocationPost, LocationPut } from '../models/location.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // private baseUrl = 'http://localhost:8080/locations';

  private baseUrl: string = `${environment.production 
        ? `${environment.apis.locations}` 
        : `${environment.apis.locations}`}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<any>(this.baseUrl).pipe(
              map(response => response.content as Location[])
            );
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/${id}`);
  }

  create(location: LocationPost): Observable<Location> {
    return this.http.post<Location>(this.baseUrl, location);
  }
  
  update(id: number, location: LocationPut): Observable<Location> {
    return this.http.put<Location>(`${this.baseUrl}/${id}`, location);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

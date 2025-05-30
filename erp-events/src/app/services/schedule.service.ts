import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  TimeSchedule,
  TimeSchedulePost,
  TimeSchedulePut,
} from '../models/schedule.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.schedules}`
      : `${environment.apis.schedules}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TimeSchedule[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((response) => response.content as TimeSchedule[]));
  }

  getById(id: number): Observable<TimeSchedule> {
    return this.http.get<TimeSchedule>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(dto: TimeSchedulePost): Observable<TimeSchedule> {
    console.log('Creating schedule with DTO:', dto);
    return this.http.post<TimeSchedule>(this.baseUrl, dto, {
      withCredentials: true,
    });
  }

  update(id: number, dto: TimeSchedulePut): Observable<TimeSchedule> {
    return this.http.put<TimeSchedule>(`${this.baseUrl}/${id}`, dto, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}

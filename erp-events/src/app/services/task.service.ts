import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Task, TaskPost, TaskPut } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // private baseUrl = 'http://localhost:8080/tasks';

  private baseUrl: string = `${environment.production 
        ? `${environment.apis.tasks}` 
        : `${environment.apis.tasks}`}`;
  
    constructor(private http: HttpClient) {}
  
    getAll(): Observable<Task[]> {
      return this.http.get<any>(this.baseUrl, { withCredentials: true }).pipe(
            map(response => response.content as Task[])
          );
    }
  
    getById(id: number): Observable<Task> {
      return this.http.get<Task>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
  
    create(supplier: TaskPost): Observable<Task> {
      return this.http.post<Task>(this.baseUrl, supplier, { withCredentials: true });
    }
  
    update(id: number, supplier: TaskPut): Observable<Task> {
      return this.http.put<Task>(`${this.baseUrl}/${id}`, supplier, { withCredentials: true });
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }
}

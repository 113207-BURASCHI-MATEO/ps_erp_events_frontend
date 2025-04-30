import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee, EmployeePost, EmployeePut } from '../../models/employee.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://localhost:8080/employees'; // Cambiar si es necesario

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<any>(this.baseUrl, { withCredentials: true }).pipe(
      map(response => response.content as Employee[])
    );
  }

  create(employee: EmployeePost): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee, { withCredentials: true });
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
  
  update(id: number, data: EmployeePut): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  
}

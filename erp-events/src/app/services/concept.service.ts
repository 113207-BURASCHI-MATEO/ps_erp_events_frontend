import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Concept, ConceptPost, ConceptPut } from '../models/account.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConceptService {
  private baseUrl: string = `${
    environment.production
      ? `${environment.apis.concepts}`
      : `${environment.apis.concepts}`
  }`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Concept[]> {
    return this.http
      .get<any>(this.baseUrl, { withCredentials: true })
      .pipe(map((res) => res.content as Concept[]));
  }

  getById(id: number): Observable<Concept> {
    return this.http.get<Concept>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  create(concept: ConceptPost): Observable<Concept> {
    return this.http.post<Concept>(this.baseUrl, concept, {
      withCredentials: true,
    });
  }

  update(id: number, concept: ConceptPut): Observable<Concept> {
    return this.http.put<Concept>(`${this.baseUrl}/${id}`, concept, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getByAccountId(idAccount: number): Observable<Concept[]> {
    return this.http
      .get<any>(`${this.baseUrl}/account/${idAccount}`, {
        withCredentials: true,
      })
      .pipe(map((res) => res.content as Concept[]));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Classe } from '../models/classe.model';
const baseurl = "http://localhost:8080/api/v1/test/classes";

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private baseUrl: string = "http://localhost:8080/api/v1/test/classes";

  constructor(private http: HttpClient) { }

  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.baseUrl).pipe(
      map(response => response)
    );
  }

  create(data: any): Observable<Classe> {
    return this.http.post<Classe>(this.baseUrl, data).pipe(
      map(response => response)
    );
  }

  update(id: any, data: any): Observable<Classe> {
    return this.http.put<Classe>(`${this.baseUrl}/${id}`, data).pipe(
      map(response => response)
    );
  }

  delete(id: any): Observable<Classe> {
    return this.http.delete<Classe>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    );
  }

  deleteAll(): Observable<Classe> {
    return this.http.delete<Classe>(this.baseUrl).pipe(
      map(response => response)
    );
  }

  getClasse(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    )
  }
}

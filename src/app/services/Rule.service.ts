import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rule } from '../models/Rule.model';


@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private baseUrl: string = "http://localhost:8080/api/rules";

  constructor(private http: HttpClient) { }

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${this.baseUrl}/rules`).pipe(
      map(response => response)
    );
  }

  create(data: Rule): Observable<Rule> {
    return this.http.post<Rule>(this.baseUrl, data).pipe(
      map(response => response)
    );
  }


  update(id: any, data: any): Observable<Rule> {
    return this.http.put<Rule>(`${this.baseUrl}/${id}`, data).pipe(
      map(response => response)
    );
  }

  delete(id: any): Observable<Rule> {
    return this.http.delete<Rule>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    );
  }

  deleteAll(): Observable<Rule> {
    return this.http.delete<Rule>(this.baseUrl).pipe(
      map(response => response)
    );
  }

  getRule(id: number): Observable<Rule> {
    return this.http.get<Rule>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    )
  }
}

// operation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Operation } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
    private baseUrl: string = "http://localhost:8080/api/v1/test/operation";
    filtreStatus: string | null = null;
    filtreType: string | null = null;

  constructor(private http: HttpClient) { }

  getOperations(status: string | null, type: string | null): Observable<Operation[]> {
    // Créer un objet HttpParams pour gérer les paramètres de la requête
    let params = new HttpParams();
    
    // Ajouter les paramètres à la requête s'ils sont fournis
    if (status) {
      params = params.set('status', status);
    }

    if (type) {
      params = params.set('type', type);
    }

    // Utiliser les paramètres dans la requête HTTP
    return this.http.get<Operation[]>(this.baseUrl, { params });
  }
  getOperationById(id: number): Observable<Operation> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Operation>(url);
  }
  getOperation(id: number): Observable<Operation> {
    return this.http.get<Operation>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    )
  }

  getJustificatif(operationId: number): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/${operationId}/justificatif`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });
    return this.http.get(url, { responseType: 'arraybuffer', headers });
  }

  updateOperation(id: number, updatedOperation: Operation): Observable<Operation> {
    const url = `${this.baseUrl}/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  // Ajoutez cette ligne

    return this.http.put<Operation>(url, updatedOperation);
  }
}

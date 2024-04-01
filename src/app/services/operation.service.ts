// operation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Operation } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
    private baseUrl: string = "http://localhost:8080/api/v1/test/operation";
    operations: Operation[] = [];  // Ajoutez cette ligne pour stocker les opérations côté client

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


  update(id: any, updated: any): Observable<Operation> {
    return this.http.put<Operation>(`${this.baseUrl}/${id}`, updated).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour de l\'opération:', error);
        if (error.status === 400) {
          return throwError('Une erreur s\'est produite lors de la mise à jour de l\'opération.');
        }
        return throwError('Une erreur inattendue s\'est produite.');
      })
    );
  }
}  
  


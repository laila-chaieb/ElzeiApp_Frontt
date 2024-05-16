// operation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Operation } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
    private baseUrl: string = "http://192.168.1.38:8080/api/v1/test/operation";
    operations: Operation[] = [];  // Ajoutez cette ligne pour stocker les opérations côté client

    filtreStatus: string | null = null;
    filtreType: string | null = null;
    filtreMonth: string | null = null;

  constructor(private http: HttpClient) { }

  getOperations(status: string | null, type: string | null, mois: number | null): Observable<Operation[]> {
    let params = new HttpParams();
  
    if (status) {
      params = params.set('status', status);
    }
    if (type) {
      params = params.set('type', type);
    }
    if (mois !== null) {
      params = params.set('mois', mois.toString());
    }
  
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

  searchOperation(searchTerm: string): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.baseUrl}`).pipe(
      map(Operation => {
        if (!isNaN(+searchTerm)) { // Vérifie si searchTerm est un nombre
          return Operation.filter(c => c.libelle === searchTerm);
        } else if (searchTerm.includes('')) {
          const searchTermParts = searchTerm.split(' ').filter(part => part.trim() !== ''); // Sépare les parties de searchTerm
          const searchTermRegex = new RegExp(searchTermParts.join('.*'), 'i'); // Crée une expression régulière pour rechercher le nom ou le prénom composé
          return Operation.filter(s => searchTermRegex.test(s.compte?.libele) || searchTermRegex.test(s.libelle));
        } else {
          return Operation.filter(s => s.compte?.libele === searchTerm || s.libelle === searchTerm);
        }
      })
    );
  }

}  
  


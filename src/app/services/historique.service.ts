import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historique } from '../models/historique.model';


@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  private baseUrl = 'http://192.168.1.38:8080/api/historique'; // URL de base de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer l'historique dans le backend
  saveHistorique(historique: Historique): Observable<any> {
    return this.http.post(`${this.baseUrl}/enregistrer`, historique);
  }

  deleteOperationsByLibelle(libelle: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/operations?libelle=${libelle}`);
  }

    // Méthode pour récupérer les opérations et compter les occurrences des libellés
    getOperationLibellesCountFromHistoriques(): Observable<any> {
        return this.http.get(`${this.baseUrl}/operations`);
      }
}
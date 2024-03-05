import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,forkJoin, throwError } from 'rxjs';
import { catchError, map ,mergeMap} from 'rxjs/operators';
import { Compte } from '../models/compte.model';

@Injectable({
  providedIn: 'root'
})
export class CompteService {
  private baseUrl: string = "http://localhost:8080/api/v1/test/comptes";

  constructor(private http: HttpClient) { }
  getComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(this.baseUrl).pipe(
      map(response => response)
    );
  }

   // Nouvelle méthode pour obtenir une classe par son ID
   getClassById(id: number): Observable<any> {
    const url = `http://localhost:8080/api/v1/test/classes/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => response)
    );
  }

  create(data: any): Observable<Compte> {
    // Obtenez l'objet complet de la classe à partir de l'ID
    const classeId = data.classe_id;
    delete data.classe_id; // Supprimez la propriété classe_id du compte avant l'envoi
    if (classeId) {
      // Utilisez forkJoin pour combiner les deux observables
      return forkJoin([this.getClassById(classeId)]).pipe(
        // Utilisez mergeMap pour accéder aux résultats du forkJoin
        mergeMap(([classe]: any) => {
          data.classe = classe; // Ajoutez l'objet complet de la classe au compte
          // Envoie la requête POST pour créer le compte avec la classe associée
          return this.http.post<Compte>(this.baseUrl, data);
        })
      );
    } else {
      // Si classe_id n'est pas spécifié, envoyez simplement la requête POST sans la classe associée
      return this.http.post<Compte>(this.baseUrl, data).pipe(
        map(response => response)
      );
    }
  }

  update(id: any, data: any): Observable<Compte> {
    return this.http.put<Compte>(`${this.baseUrl}/${id}`, data).pipe(
      map(response => {
        console.log('Update successful:', response);
        return response;
      }),
      catchError(error => {
        console.error('Update failed:', error);
        return throwError(error);
      })
    );
  }

  delete(id: any): Observable<Compte> {
    return this.http.delete<Compte>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    );
  }

  deleteAll(): Observable<Compte> {
    return this.http.delete<Compte>(this.baseUrl).pipe(
      map(response => response)
    );
  }

  getCompte(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.baseUrl}/${id}`).pipe(
      map(response => response)
    )
  }
 

  getComptesByClasseId(classeId: number): Observable<Compte[]> {
    const url = `${this.baseUrl}/byClasse/${classeId}`;
    return this.http.get<Compte[]>(url).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des comptes par classe', error);
        throw error; 
      })
    );
  }
 
}
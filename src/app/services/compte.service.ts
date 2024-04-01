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
    const classeId = data.classe_id;
    const parentCompteId = data.parent_compte_id; // Récupérer l'ID du parentCompte

    // Supprimer les propriétés classe_id et parent_compte_id du compte avant l'envoi
    delete data.classe_id;
    delete data.parent_compte_id;

    if (classeId) {
        // Utiliser forkJoin pour combiner les deux appels
        return forkJoin([
            this.getClassById(classeId),
            this.getCompte(parentCompteId) // Ajouter cet appel pour récupérer le parentCompte
        ]).pipe(
            mergeMap(([classe, parentCompte]: any) => {
                data.classe = classe;
                data.parentCompte = parentCompte; // Ajouter l'objet parentCompte à data
                return this.http.post<Compte>(this.baseUrl, data);
            })
        );
    } else {
        // Si classe_id n'est pas spécifié, envoyer simplement la requête POST sans la classe associée
        return this.http.post<Compte>(this.baseUrl, data);
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
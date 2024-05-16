import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MappingService {
    private baseUrl: string = "http://192.168.1.38:8080/api/v1/test/mapping";

    constructor(private http: HttpClient) { }
  
    // Méthode pour mapper à partir d'une opération brute (RawOperation)
    mapFromRawOperation(): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/rawOperation`, {});
    }
  
    // Méthode pour mapper à partir d'un message CFONB
    mapFromCfonb(): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/mapFromCfonb`, {});
    }
}

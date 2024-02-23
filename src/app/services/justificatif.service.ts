// operation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JustificatifService {
    private baseUrl: string = "http://localhost:8080/api/v1/test/justificatif";


  constructor(private http: HttpClient) { }
  uploadJustificatifFile(file: File, description: string,operationId: number): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
formData.append('file', file, file.name);
formData.append('description', description);
formData.append('operationId', operationId.toString());



  
    // Notez le type de retour ici
    return this.http.post<HttpResponse<any>>(`${this.baseUrl}/upload`, formData, { observe: 'response' });
  }
}

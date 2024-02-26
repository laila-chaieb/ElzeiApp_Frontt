import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class JustificatifService {
  private baseUrl: string = "http://localhost:8080/api/v1/test/justificatif";

  constructor(private http: HttpClient) { }

  uploadJustificatifFile(file: File, description: string, operationId: number):
    Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('description', description);
    formData.append('operationId', operationId.toString());

    return this.http.post(`${this.baseUrl}/upload`, formData, { observe: 'response', responseType: 'arraybuffer' });
  }
  downloadJustificatif(id: number): Observable<HttpResponse<any>> {
    return this.http.get(`${this.baseUrl}/download/${id}`, {
      observe: 'response',
      responseType: 'arraybuffer' as 'json'
    }).pipe(
      map(response => {
        const blob = new Blob([response.body instanceof Object ? JSON.stringify(response.body) : response.body || ''], { type: 'application/pdf' });
        saveAs(blob, 'justificatif.pdf');
        return response;
      })
    );
  }
}
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private baseUrl: string = "http://localhost:8080/api/v1/test/mapping";
  constructor(private http: HttpClient) { }
  mapFromCfonb(): void {
    // Envoyer une requête HTTP POST pour mapper à partir de CFONB
    this.http.post(this.baseUrl + '/mapFromCfonb', {}).subscribe(
      () => {
        console.log('Mapping from CFONB successful');
      },
      (error) => {
        console.error('Error mapping from CFONB:', error);
      }
    );
  }

  mapFromRawOperation(): void {
    // Envoyer une requête HTTP POST pour mapper à partir d'une opération brute
    this.http.post(this.baseUrl + '/rawOperation', {}).subscribe(
      () => {
        console.log('Mapping from Raw Operation successful');
      },
      (error) => {
        console.error('Error mapping from Raw Operation:', error);
      }
    );
  }
}
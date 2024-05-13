import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RuleService } from './services/Rule.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private baseUrl: string = "http://localhost:8080/api/v1/test/mapping";
  constructor(private http: HttpClient,private ruleService: RuleService) { }
  mapFromCfonb(): void {
    // Envoyer une requête HTTP POST pour mapper à partir de CFONB
    this.http.post(this.baseUrl + '/mapFromCfonb', {}).subscribe(
      () => {
        window.alert('Mapping from CFONB successful');
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
        window.alert('Mapping from Raw Operation successful');
      },
      (error) => {
        console.error('Error mapping from Raw Operation:', error);
      }
    );
  }

  generateAndWriteRules(): void {
    this.ruleService.generateAndWriteRulesDRL().subscribe(
      () => { // Utilisation de la fonction anonyme pour ignorer 'response'
        window.alert("Rules generated and written successfully");
      },
      error => {
        window.alert("Error generating and writing rules: " + error.message);
      }
    );
  }

 
  executeRules(): void {
    this.ruleService.executeRules().subscribe(
      (response: string) => {
        window.alert("Rules executed successfully: " + response);
      },
      error => {
        window.alert("Error executing rules: " + error.message);
      }
    );
  }

}
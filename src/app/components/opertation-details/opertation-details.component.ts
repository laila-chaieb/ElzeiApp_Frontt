import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Classe } from 'src/app/models/classe.model';
import { Compte } from 'src/app/models/compte.model';
import { Operation } from 'src/app/models/operation.model';
import { ClasseService } from 'src/app/services/classe.service';
import { CompteService } from 'src/app/services/compte.service';
import { OperationService } from 'src/app/services/operation.service';
import { MatSelect } from '@angular/material/select';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { JustificatifService } from 'src/app/services/justificatif.service';

@Component({
  selector: 'app-opertation-details',
  templateUrl: './opertation-details.component.html',
  styleUrls: ['./opertation-details.component.css']
})
export class OpertationDetailsComponent {

  constructor(private  compteService:CompteService,private  OperationService:OperationService, private activatedRoute: ActivatedRoute ,
    private router: Router,   private http: HttpClient,private classeService: ClasseService,private justificatifService:JustificatifService) {
      const state = this.router.getCurrentNavigation()?.extras?.state;
      

     }
     selectedOperation: Operation | undefined;
     classes:any;
     operation: Operation |null=null;  // Assurez-vous que la propriété est déclarée ici
     selectedClasse: Classe | undefined;
    
   selectedCompteId: any | null = null;
   private baseUrl: string = "http://localhost:8080/api/v1/test/justificatif";

   selectedCompte: Compte = new Compte();
   classeId: string = 'all';
   comptes: Compte[] = [];
   selectedClasseColor: string | undefined;
   ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const operationId = +params['id'];
      const classeId = +params['id'];
  
      // Récupérer les détails de l'operation depuis le service
      this.OperationService.getOperation(operationId).subscribe(
        (operation) => {
          this.selectedOperation = operation;
  
          // Récupérer les détails de la classe depuis le service
          this.classeService.getClasse(classeId).subscribe(
            (classe) => {
              this.selectedClasse = classe;
  
              // Chargez tous les comptes initialement
              this.fetchComptes('all'); // Assurez-vous que la classeId passée ici est valide
            },
            (error) => {
              console.error('Erreur lors du chargement des détails de la classe', error);
            }
          );
        },
        (error) => {
          console.error('Erreur lors du chargement des détails de l\'opération', error);
        }
      );
    });
  
    // Chargez la liste des classes
    this.listClasses();
  }
 
  


  onCompteChange(event: any): void {
    const selectedCompteId = event?.target?.value;

    // Mettez à jour la valeur sélectionnée
    this.selectedCompteId = selectedCompteId;
  
    // Si selectedCompteId est null, cela signifie que l'utilisateur saisit manuellement
    if (selectedCompteId === null) {
      // Effectuez le traitement nécessaire pour une saisie manuelle
      // Par exemple, vous pouvez réinitialiser la liste des comptes ici
      this.fetchComptes(this.selectedClasse?.id?.toString() || '0');
    }
    console.log('onCompteChange');

  }
  
  
  

  listClasses(){
 
    this.classeService.getClasses().subscribe((res:any) =>{
      this.classes=res
      console.log("reponse",this.classes)
     
    }
    )
  }
 

listComptes(){

this.compteService.getComptes().subscribe((res:any) =>{
 this.comptes=res
 console.log("reponse",this.comptes)

}
)
}

fetchComptes(classeId: string): void {
  const url = classeId === 'all'
    ? 'http://localhost:8080/api/v1/test/comptes'
    : `http://localhost:8080/api/v1/test/byClasse/${classeId}`;

  this.http.get<any[]>(url).subscribe(
    (comptes) => {
      this.comptes = comptes;
    },
    (error) => {
      console.error('Erreur lors du chargement des comptes', error);
    }
  );
}
@ViewChild('compteSelect') compteSelect!: MatSelect;

filteredComptes: Compte[] = [];
onClasseChange(event: any): void {
  const selectedClasseId = event.target.value.toString();
  this.fetchComptes(selectedClasseId);
}

onCompteFilter(event: Event): void {
  const target = event.target as HTMLInputElement;
  const filterText = target.value;

  // Filtrer les comptes en fonction du texte de filtrage et de la classe sélectionnée
  this.filteredComptes = this.comptes.filter(compte =>
    compte && compte.libele && compte.libele.toLowerCase().includes(filterText.toLowerCase())
  );

  // Ouvrir automatiquement la liste déroulante
  if (this.compteSelect) {
    this.compteSelect.open();
  }
}

editOperation(id: number) {
  this.OperationService.getOperation(id).subscribe(
    (operation) => {
      
    },
    (error) => {
      console.error('Error retrieving operation details', error);
    }
  );
}



onFileSelected(event: any): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file && this.selectedOperation) {
    // Mettez à jour le justificatif de l'opération sélectionnée
    this.selectedOperation.justificatif = file;

    // Vous pouvez également afficher le nom du fichier ou autre chose si nécessaire
    console.log('Selected file:', file.name);
  }
}

updateOperation(id: number, updatedOperation: Operation, justificatifFile: File | null): Observable<Operation> {
  const url = `${this.baseUrl}/${id}`;
  
  // Utiliser FormData pour envoyer le fichier
  const formData = new FormData();
  formData.append('updatedOperation', JSON.stringify(updatedOperation)); // Convertir l'objet Operation en chaîne JSON
  if (justificatifFile) {
    formData.append('justificatif', justificatifFile);
  }

  return this.http.put<Operation>(url, formData);
}


onSubmit(): void {
  if (this.selectedOperation && this.selectedOperation.justificatif) {
      const file = this.selectedOperation.justificatif;
      const description = this.selectedOperation.description || ''; // Ajoutez la logique appropriée
      const operationId = this.selectedOperation.id || 0; // Assurez-vous que vous avez l'ID de l'opération
      console.log('Operation ID:', operationId); // Ajoutez cette ligne

      this.router.navigate(['/operation']);
      // Appeler le service pour effectuer l'upload
      this.justificatifService.uploadJustificatifFile(file, description, this.selectedOperation.id).subscribe(
          (response) => {
              // Vérifier le type de contenu
              const contentType = response.headers.get('Content-Type');

              if (contentType && contentType.indexOf('application/json') !== -1) {
                  // La réponse est de type JSON
                  const jsonResponse = response.body;
                  console.log('File uploaded successfully:', jsonResponse);
                  // Effectuez les actions nécessaires après l'upload du fichier
              } else {
                  // La réponse n'est pas du JSON, traiter en conséquence
                  console.log('File uploaded successfully. Server response:', response.body);
                  // Effectuez les actions nécessaires après l'upload du fichier
              }
          },
          (error) => {
              if (error.status === 200) {
                  // Traitement d'erreur spécifique si le serveur retourne un statut 200 (OK) malgré une erreur
                  console.error('Error uploading file. Server response:', error.error);
              } else {
                  console.error('Error uploading file. Status:', error.status, 'Error:', error.error);
              }
              // Affichez un message d'erreur ou effectuez d'autres actions nécessaires
          }
      );
  }
}




  }

 



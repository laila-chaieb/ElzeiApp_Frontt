import { HttpClient } from '@angular/common/http';
import { Component,  ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Classe } from 'src/app/models/classe.model';
import { Compte } from 'src/app/models/compte.model';
import { Operation } from 'src/app/models/operation.model';
import { ClasseService } from 'src/app/services/classe.service';
import { CompteService } from 'src/app/services/compte.service';
import { OperationService } from 'src/app/services/operation.service';
import { MatSelect } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { JustificatifService } from 'src/app/services/justificatif.service';
import { switchMap, tap } from 'rxjs';
import { ElementRef } from '@angular/core';
@Component({
  selector: 'app-opertation-details',
  templateUrl: './opertation-details.component.html',
  styleUrls: ['./opertation-details.component.css']
})
export class OpertationDetailsComponent {

  constructor(private  compteService:CompteService,private  OperationService:OperationService, private activatedRoute: ActivatedRoute ,
    private router: Router,   private http: HttpClient,private classeService: ClasseService,private justificatifService:JustificatifService,private elementRef: ElementRef) {
      const state = this.router.getCurrentNavigation()?.extras?.state;
      

     }
     @ViewChild('compteSelect') compteSelect!: MatSelect;
     selectedCompte: Compte | undefined = undefined;
     
     selectedOperation: any = {};
     operationId: number | undefined;


     classes:any;
     filteredComptes: Compte[] = [];
     selectedCompteId: any | null = null;
     private baseUrl: string = "http://localhost:8080/api/v1/test/justificatif";
     operation: Operation | null = null; // Initialize operation with an empty object
     selectedClasse: Classe | undefined;
  
     classeId: string = 'all';
     comptes: Compte[] = [];
     selectedClasseColor: string | undefined;
     ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        this.operationId = +params['id'];
        const classeId = +params['id'];
        
        // Récupérer les détails de l'operation depuis le service
        this.OperationService.getOperationById(this.operationId).subscribe(
          (operation) => {
            this.selectedOperation = operation;
            console.log('Opération:', operation); // Afficher l'objet operation dans la console
          },
          (error) => {
            console.error('Erreur lors du chargement des détails de l\'opération', error);
          }
        );
        
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
      });
      this.listClasses()
    } 
    
    onCompteChange(event: any): void {
      // Obtenez la valeur sélectionnée du MatSelect
      const selectedCompteId = this.compteSelect.value;
    
      // Mettez à jour la valeur sélectionnée
      this.selectedCompteId = selectedCompteId;
    
      // Si selectedCompteId est null, cela signifie que l'utilisateur saisit manuellement
      if (selectedCompteId === null) {
        // Effectuez le traitement nécessaire pour une saisie manuelle
        // Par exemple, vous pouvez réinitialiser la liste des comptes ici
        this.fetchComptes('all');
      } else {
        // Recherchez le compte correspondant à l'ID sélectionné
        this.selectedCompte = this.comptes.find(c => c.id === selectedCompteId);
    
        // Si aucun compte n'a été trouvé, affectez selectedCompte à undefined
        if (!this.selectedCompte) {
          this.selectedCompte = undefined;
        }
      }
    }

  listClasses(){
 
    this.classeService.getClasses().subscribe((res:any) =>{
      this.classes=res
    
     
    }
    )
  }
 

listComptes(){

this.compteService.getComptes().subscribe((res:any) =>{
 this.comptes=res
 

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

      // Si un compte a été sélectionné, recherchez-le dans la liste des comptes
      if (this.selectedCompteId !== null) {
        this.selectedCompte = this.comptes.find(c => c.id === this.selectedCompteId);

       
      }
    },
    (error) => {
      console.error('Erreur lors du chargement des comptes', error);
    }
  );
}


onClasseChange(event: any): void {
  const selectedClasseId = event.target.value.toString();
  this.fetchComptes(selectedClasseId);
}

onCompteFilter(event: Event): void {
  const target = event.target as HTMLInputElement;
  const filterText = target.value.toLowerCase(); // Convertir en minuscules

  // Filtrer les comptes en fonction du texte de filtrage et de la classe sélectionnée
  this.filteredComptes = this.comptes.filter(compte =>
    compte && compte.code.toString().toLowerCase().includes(filterText) || (compte.libele && compte.libele.toLowerCase().includes(filterText))
  );

  // Ouvrir automatiquement la liste déroulante
  if (this.compteSelect) {
    this.compteSelect.open();
  }
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

updateOperationProperty(operation: Operation, propertyName: string, propertyValue: any): void {
  console.log('updateOperationProperty called');
  console.log('propertyName:', propertyName);
  console.log('propertyValue:', propertyValue);

  // Mettez à jour l'objet de manière incrémentielle
  operation[propertyName] = propertyValue;

  // Envoyez uniquement la propriété modifiée
  const updateData = { [propertyName]: propertyValue };

  // Vérifiez si la propriété est 'compte' et ajustez le service en conséquence
  if (propertyName === 'compte') {
    const updateData = { [propertyName]: propertyValue ,status: 'Validee'};
    this.OperationService.update(operation.id, updateData).subscribe(
      (response: any) => {
        if (response && typeof response === 'object' && response.hasOwnProperty('error')) {
          console.error(`Erreur lors de la mise à jour de ${propertyName}:`, response.error);
          // Gérez l'erreur et affichez un message approprié si nécessaire
        } else {
          console.log(`${propertyName} mis à jour avec succès:`, response);
          // Ajoutez des actions supplémentaires si nécessaire
        }
      },
      (error) => {
        console.error(`Erreur lors de la mise à jour de ${propertyName}:`, error);
        // Gérez l'erreur et affichez un message approprié si nécessaire
      }
    );
  } else {
    // Utilisez le service 'operationService' pour les autres propriétés
    this.OperationService.update(operation.id, updateData).subscribe(
      (response) => {
        if (response && typeof response === 'object' && response.hasOwnProperty('error')) {
          console.error(`Erreur lors de la mise à jour de ${propertyName}:`, (response as any).error);
          // Gérez l'erreur et affichez un message approprié si nécessaire
        } else {
          console.log(`${propertyName} mis à jour avec succès:`, response);
          // Ajoutez des actions supplémentaires si nécessaire
        }
      },
      (error) => {
        console.error(`Erreur lors de la mise à jour de ${propertyName}:`, error);
        // Gérez l'erreur et affichez un message approprié si nécessaire
      }
    );
  }
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



selectCompte(compte: Compte): void {
  this.selectedCompteId = compte.id;
  this.selectedCompte = compte;
  // Vous pouvez effectuer d'autres actions ici si nécessaire, comme la fermeture de la liste après la sélection

  // Mettez à jour l'opération avec le compte sélectionné
  this.selectedOperation.compte = compte;
  // Appelez la méthode d'update pour mettre à jour l'opération avec le nouveau compte
  this.updateOperationProperty(this.selectedOperation, 'compte', compte);
}


  }

 



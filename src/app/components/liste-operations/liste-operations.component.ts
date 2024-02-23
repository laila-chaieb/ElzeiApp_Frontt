import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { Operation } from 'src/app/models/operation.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { JustificatifService } from 'src/app/services/justificatif.service';
@Component({
  selector: 'app-liste-operations',
  templateUrl: './liste-operations.component.html',
  styleUrls: ['./liste-operations.component.css']
})
export class ListeOperationsComponent implements OnInit {
  operations: Operation[] = [];
  filtreStatus: string | null = null;
  filtreType: string | null = null;
  selectedOperation: Operation | null = null;
  tauxTVAOptions: number[] = [20, 10, 5.5, 2.1];
  constructor(
    private operationService: OperationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private justificatifService:JustificatifService
  ) {}
  selectOperation(operation: Operation): void {
    this.selectedOperation = operation;
  }
  appliquerFiltre(status: string | null, type: string | null): void {
    this.filtreStatus = status;
    this.filtreType = type;
    this.listOperations();
    this.closeDropdown();
  }
  
  
  listOperations(): void {
    console.log('Filtrage en cours avec status:', this.filtreStatus);
    console.log('Filtrage en cours avec type:', this.filtreType);
    this.operationService.getOperations(this.filtreStatus, this.filtreType).subscribe(
        (res: any) => {
            console.log('Résultats après filtrage:', res);
            this.operations = res;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de tauxTVA:', error);
          
          try {
              const errorBody = JSON.parse(error.error);
              console.log('Corps de la réponse en erreur:', errorBody);
              // Gérer le corps de l'erreur JSON
          } catch (e) {
              console.log('La réponse derreur n\'est pas un JSON valide:', error.error);
              // Gérer le cas où la réponse n'est pas un JSON valide
          }
      
          // Ajoutez des actions supplémentaires si nécessaire
      })
  }


  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const successMessage = params['success'];
 
  
      if (successMessage) {
        console.log(successMessage);
        // Affichez le message de succès dans votre template ou effectuez les actions nécessaires
      }
      this.listOperations();
    });
  }

  isDropdownOpen: boolean[] = [false, false];

  toggleDropdown(index: number): void {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  closeDropdown() {
    this.isDropdownOpen[0] = false;
    this.isDropdownOpen[1] = false;
 
 }


 viewOperationDetails(Operation: any): void {
  this.router.navigate(['detailsOperation', Operation.id]);

}

downloadJustificatif(operation: Operation): void {
  this.operationService.getJustificatif(operation.id).subscribe((data: ArrayBuffer) => {
    const blob = new Blob([data], { type: 'application/pdf' });
  //  saveAs(blob, `Justificatif_${operation.id}.pdf`);
  });
}
onFileSelected(event: any): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file && this.selectedOperation) {
    // Mettez à jour le justificatif de l'opération sélectionnée
    this.selectedOperation.justificatif = file;
  }
}

onJustificatifChange(event: any, operationId: number): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  if (file) {
    // Appeler le service pour effectuer l'upload directement depuis la liste des opérations
    this.justificatifService.uploadJustificatifFile(file, '', operationId).subscribe(
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


updateOperationProperty(operation: Operation, propertyName: string, propertyValue: any): void {
  // Mettez à jour l'objet de manière incrémentielle
  operation[propertyName] = propertyValue;

  this.operationService.update(operation.id, operation).subscribe(
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





import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { Operation } from 'src/app/models/operation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { JustificatifService } from 'src/app/services/justificatif.service';
import { HttpResponse } from '@angular/common/http';
import { CompteService } from 'src/app/services/compte.service';
import { Compte } from 'src/app/models/compte.model';
@Component({
  selector: 'app-liste-operations',
  templateUrl: './liste-operations.component.html',
  styleUrls: ['./liste-operations.component.css']
})
export class ListeOperationsComponent implements OnInit {

  //Declaration
  searchTerm: string = '';

  operations: Operation[] = [];
  comptes: Compte[] = [];
  filtreMois: number | null = null;
  filtreStatus: string | null = null;
  filtreType: string | null = null;
  selectedOperation: Operation | null = null;
  tauxTVAOptions: number[] = [20, 10, 5.5, 2.1];
  constructor(
    private operationService: OperationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private justificatifService: JustificatifService,
    private compteService: CompteService,
  ) { }


  search(): void {
    if (this.searchTerm.trim()) {
      this.operationService.searchOperation(this.searchTerm).subscribe(clients => { // Renamed client to clients
        this.operations = clients; // Renamed client to clients
      });
    } else {
      
      this.listOperations();//Renamed loadClient to loadClients for consistency
    }
  }

  sortOperationsById(): void {
    this.operations.sort((a, b) => a.id - b.id);
  }
// Filtrage
appliquerFiltre(statut: string | null, type: string | null, mois: number | null) {
  this.filtreStatus = statut;
  this.filtreType = type;
  this.filtreMois = mois;
  this.listOperations();
  this.closeDropdown();
}
 
// listOperations method
listOperations(): void {
  console.log('Filtrage en cours avec status:', this.filtreStatus);
  console.log('Filtrage en cours avec type:', this.filtreType);
  console.log('Filtrage en cours avec mois:', this.filtreMois);

  // Appel au service pour récupérer les opérations avec tous les filtres
  this.operationService.getOperations(this.filtreStatus, this.filtreType, this.filtreMois).subscribe(
      (res: Operation[]) => {
          this.operations = res; // On suppose que le backend gère maintenant tous les filtres
          console.log('Opérations filtrées:', this.operations);
          this.operations.forEach(operation => {
              console.log('Opération:', operation);
              if (operation['compte']) {
                  console.log('Compte associé:', operation['compte']);
              } else {
                  console.log('Aucun compte associé à cette opération.');
              }
          });
      },
      (error) => {
          console.error('Erreur lors de la récupération des opérations:', error);
          try {
              const errorBody = JSON.parse(error.error);
              console.log('Corps de la réponse en erreur:', errorBody);
          } catch (e) {
              console.log('La réponse d\'erreur n\'est pas un JSON valide:', error.error);
          }
      }
  );
}




  isDropdownOpen: boolean[] = [false, false];

  toggleDropdown(index: number): void {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
    this.closeDropdownsExcept(index);
  }
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
     


    
      this.listOperations();
      this.listComptes();
    })
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const isDropdown = target.closest('.dropdown-menu');
      if (!isDropdown) {
        this.closeDropdownsExcept(-1);
      }
    });
    this.sortOperationsById();
    // Le reste de votre code ngOnInit() ici...
  }

  closeDropdown() {
    this.isDropdownOpen[0] = false;
    this.isDropdownOpen[1] = false;

  }

  closeDropdownsExcept(index: number): void {
    for (let i = 0; i < this.isDropdownOpen.length; i++) {
      if (i !== index) {
        this.isDropdownOpen[i] = false;
      }
    }
  }
  viewOperationDetails(Operation: any): void {
    this.router.navigate(['detailsOperation', Operation.id]);

  }
  downloadJustificatif(operation: Operation): void {
    this.justificatifService.downloadJustificatif(operation.id).subscribe(
      (response: HttpResponse<any>) => {
        const filename = `Justificatif_${operation.id}.pdf`;
        const blob = new Blob([response.body], { type: 'application/pdf' });

        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          // Vérifier si la méthode msSaveOrOpenBlob est définie sur le navigateur
          (window.navigator as any).msSaveOrOpenBlob(blob, filename);
        } else if (window.URL && window.URL.createObjectURL) {
          // Utiliser la méthode createObjectURL pour les navigateurs modernes
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;

          document.body.appendChild(link);
          link.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);

          // Recharger la page depuis le serveur
          location.reload();
        } else {
          console.error('La méthode de téléchargement n\'est pas prise en charge sur ce navigateur.');
        }
      },
      (error) => {
        console.error('Error downloading justificatif:', error);
      }
    );
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

    // Envoyez uniquement la propriété modifiée
    const updateData = { [propertyName]: propertyValue };

    // Envoyez la mise à jour de la propriété à votre service
    this.operationService.update(operation.id, updateData).subscribe(
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


  listComptes() {

    this.compteService.getComptes().subscribe((res: any) => {
      this.comptes = res
      console.log("reponse", this.comptes)

    }
    )
  }

}





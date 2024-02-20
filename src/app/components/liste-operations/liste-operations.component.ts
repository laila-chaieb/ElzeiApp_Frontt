import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { Operation } from 'src/app/models/operation.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
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
    this.operationService.getOperations(this.filtreStatus, this.filtreType).subscribe((res: any) => {
      console.log('Résultats après filtrage:', res);
      this.operations = res;
      
    });
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
}





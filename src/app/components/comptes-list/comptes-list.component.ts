import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Compte } from 'src/app/models/compte.model';
import { CompteService } from 'src/app/services/compte.service';
import { EditDialogCompteComponent } from '../edit-dialog-compte/edit-dialog-compte.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-comptes-list',
  templateUrl: './comptes-list.component.html',
  styleUrls: ['./comptes-list.component.css']
})
export class ComptesListComponent {
  
  constructor(private compteService: CompteService,private activatedRoute: ActivatedRoute ,
    public dialog: MatDialog
,    private router: Router) { }
searchTerm: string = '';

  selectedCompte:  Compte = {
    id: 0,
    libele: '',
    code: '',
    description: '',
    classe_id: 0,
    parent_compte_id: null,
    classeNumcl: '',
    classeNom: '',
    Classe: {
      id: 0,
      description: '',
      nom: '',
      numcl: ''
    }
  };
  comptes:any;
  isEditing: boolean = false;
  filters = {
    keyword: '',
    sortBy: 'nom'
  }
  successMessage: string = '';

   updatedCompte: Compte = {
     id: this.selectedCompte.id,
     libele: this.selectedCompte.libele,
     code: this.selectedCompte.code,
     description: this.selectedCompte.description,
     classe_id: this.selectedCompte.classe_id,
     parent_compte_id: null,
     classeNumcl: '',
     classeNom: '',
     Classe: {
      id: 0,
      description: '',
      nom: '',
      numcl: ''
    }
   };
  
  listComptes(){
 
    this.compteService.getComptes().subscribe((res:any) =>{
      this.comptes=res
      console.log("reponse comptes",this.comptes)
     
    }
    )
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const successMessage = params['success'];
      if (successMessage) {
        console.log(successMessage);
        this.listComptes();
       
      }
    });
  
    this.listComptes();
  }

  deleteCompte(id: number) {
    this.compteService.delete(id).subscribe(
      () => {
        console.log("Compte deleted successfully.");
        this.listComptes();
      
        this.router.navigate(['/Comptes']);
      },
      (error: HttpErrorResponse) => {
        console.error("Error deleting Compte:", error);
      }
    );
  }
 
  search(): void {
    if (this.searchTerm.trim()) {
      this.compteService.searchCompte(this.searchTerm).subscribe(clients => { // Renamed client to clients
        this.comptes = clients; // Renamed client to clients
      });
    } else {
      this.listComptes(); //Renamed loadClient to loadClients for consistency
    }
  }
  editCompte(id: number) {
    this.compteService.getCompte(id).subscribe(
      (compte) => {
        this.selectedCompte = compte;
            const dialogRef = this.dialog.open(EditDialogCompteComponent, {
              width: '300px',
              data: { ...this.selectedCompte } 
            });
    
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.updateCompte(result);
              }
            });
          },
      (error) => {
        console.error('Error retrieving Compte details', error);
      }
    );
  }
  updateCompte(updatedCompte: Compte) {
   
    this.compteService.update(updatedCompte.id, updatedCompte).subscribe(
      (updatedCompte) => {
        console.log('Classe updated:', updatedCompte);
        this.listComptes();
        // Effectuez les actions nécessaires après la mise à jour de la classe
        this.router.navigate(['/']);      },
     
      (error) => {
        this.router.navigate(['/Comptes']);
        console.error('Error updating compte', error);
   
        // Affichez un message d'erreur
      }
    );
  }
    
  
   
       
    
    
    
  }
  
  
  
  



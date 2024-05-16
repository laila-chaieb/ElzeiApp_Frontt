import { Component, OnInit,Inject } from '@angular/core';
import { Classe } from 'src/app/models/classe.model';
import { ClasseService } from 'src/app/services/classe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {  EditDialogComponentComponent } from '../edit-dialog/edit-dialog-component.component';
import { CompteService } from 'src/app/services/compte.service';




@Component({
  selector: 'app-liste-classes',
  templateUrl: './liste-classes.component.html',
  styleUrls: ['./liste-classes.component.css'],
})
export class ListeClassesComponent implements OnInit {
  constructor(private classeService: ClasseService,
    private activatedRoute: ActivatedRoute , private router: Router,
    public dialog: MatDialog,private  compteService:CompteService
   
 ) { }
 searchTerm: string = '';

  selectedClasse?: Classe ;
  classes:any;
  comptes: any;
  isEditing: boolean = false;
  filters = {
    keyword: '',
    sortBy: 'nom'
  }

  successMessage: string = '';

 
  
  listClasses(){
 
    this.classeService.getClasses().subscribe((res:any) =>{
      this.classes=res
      console.log("reponse",this.classes)
     
    }
    )
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const successMessage = params['success'];
      if (successMessage) {
        console.log(successMessage);
        // Affichez le message de succès dans votre template ou effectuez les actions nécessaires
      }
    });
  
    this.listClasses();
  }
  consulterComptes(classeId: number) {
    this.compteService.getComptesByClasseId(classeId).subscribe(
      (comptes) => {
        this.comptes = comptes;
      },
      (error) => { 
        console.error('Erreur lors du chargement des comptes', error);
      }
    );
  }

  deleteClasse(id: number) {
    this.classeService.delete(id).subscribe(
      () => {
        console.log('Classe deleted successfully');
        this.listClasses();
        this.router.navigate(['/Classes']);// Actualisez la liste des classes après la suppression
      },
      error => {
        console.error('Error deleting classe', error);
      }
    );
  }
  editClasse(id: number) {
    this.classeService.getClasse(id).subscribe(
      (classe) => {
        this.selectedClasse = classe;
        const dialogRef = this.dialog.open(EditDialogComponentComponent, {
          width: '400px',
          data: { ...this.selectedClasse } // Passez une copie des données pour éviter les problèmes de référence
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.updateClasse(result);
            this.listClasses();
            this.router.navigate(['/Classes']);
          }
        });
      },
      (error) => {
        console.error('Error retrieving classe details', error);
      }
    );
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.classeService.searchClasse(this.searchTerm).subscribe(clients => { // Renamed client to clients
        this.classes = clients; // Renamed client to clients
      });
    } else {
      this.listClasses();// Renamed loadClient to loadClients for consistency
    }
  }

  updateClasse(updatedClasse: Classe) {
    this.classeService.update(updatedClasse.id, updatedClasse).subscribe(
      (updatedClasse) => {
        console.log('Classe updated:', updatedClasse);
        this.listClasses();
        // Effectuez les actions nécessaires après la mise à jour de la classe
        this.router.navigate(['/Classes']);
      },
      (error) => {
        console.error('Error updating classe', error);
        // Affichez un message d'erreur
      }
    );
  }
  
  
  
}


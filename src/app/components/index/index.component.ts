import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Compte } from 'src/app/models/compte.model';
import { ClasseService } from 'src/app/services/classe.service';
import { CompteService } from 'src/app/services/compte.service';
import { EditDialogCompteComponent } from '../edit-dialog-compte/edit-dialog-compte.component';
import { MatDialog } from '@angular/material/dialog';
import { Classe } from 'src/app/models/classe.model';
import { EditDialogComponentComponent } from '../edit-dialog/edit-dialog-component.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  comptes:any;
  classes:any;
  classe1: any;
  classe2: any;
  classe :any;
  selectedCompte: Compte = new Compte();
  selectedClasse: Classe = new Classe();
  
  constructor(private  compteService:CompteService, private activatedRoute: ActivatedRoute ,
     private router: Router,public dialog: MatDialog,   private classeService: ClasseService,) { }

     private static readonly couleurs = [
      '#B1FA6B', '#90F88C', '#FFB86A', '#FDE919', '#78E6E1', '#5ECAFE', '#B591E6', '#EE81FE','#dddae6'
    ];
    
 
  listClasses(){
 
    this.classeService.getClasses().subscribe((res:any) =>{
      this.classes=res
      console.log("reponse",this.classes)
     
    }
    )
  }
  viewCompteDetails(classe: any) {
    this.router.navigate(['/Comptes', classe.id], { state: { couleur: classe.couleur } });
  }
  getCardColor(index: number): string {
    const colorIndex = index % IndexComponent.couleurs.length;
    return IndexComponent.couleurs[colorIndex];
  }
  assignColorsToClasses(classes: any[]): any[] {
    return classes.map((classe, index) => {
      return { ...classe, couleur: IndexComponent.couleurs[index] };
    });
  }
  ngOnInit(): void {
  
    this.classeService.getClasses().subscribe((classes: any) => {
      this.classes = this.assignColorsToClasses(classes);
    });
    
    this.listClasses();
}
editClasse(id: number) {
  this.classeService.getClasse(id).subscribe(
    (classe) => {
      this.selectedClasse = classe;
      const dialogRef = this.dialog.open(EditDialogComponentComponent, {
        width: '300px',
        data: { ...this.selectedClasse } // Passez une copie des données pour éviter les problèmes de référence
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateClasse(result);
        }
      });
    },
    (error) => {
      console.error('Error retrieving classe details', error);
    }
  );
}

updateClasse(updatedClasse: Classe) {
  this.classeService.update(updatedClasse.id, updatedClasse).subscribe(
    (updatedClasse) => {
      console.log('Classe updated:', updatedClasse);
      // Effectuez les actions nécessaires après la mise à jour de la classe
    },
    (error) => {
      console.error('Error updating classe', error);
      // Affichez un message d'erreur
    }
  );
}
  
}
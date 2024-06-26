import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Compte } from 'src/app/models/compte.model';
import { CompteService } from 'src/app/services/compte.service';
import { EditDialogCompteComponent } from '../edit-dialog-compte/edit-dialog-compte.component';
import { Classe } from 'src/app/models/classe.model';
import { ClasseService } from 'src/app/services/classe.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-compte-details',
  templateUrl: './compte-details.component.html',
  styleUrls: ['./compte-details.component.css']
})
export class CompteDetailsComponent {
  constructor(private  compteService:CompteService, private activatedRoute: ActivatedRoute ,
    private router: Router,public dialog: MatDialog ,   private classeService: ClasseService,private http: HttpClient)
     {
    
     }
     selectedClasse: Classe | undefined;
         private static readonly couleurs =   [
          '#B1FA6B', '#90F88C', '#FFB86A', '#FDE919', '#78E6E1', '#5ECAFE', '#B591E6', '#EE81FE','#dddae6','#dddae6','#dddae6','#dddae6','#dddae6','#dddae6'
        ];
    selectedCompte: Compte = {
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
    };;
    classeId: number=0;
    comptes: Compte[] = [];
    selectedClasseColor: string | undefined;
    classes: Classe[] = [];
    subComptes: Compte[] = []; // Tableau des sous-comptes
    parentCompte: Compte | undefined; // Définir le type de parentCompte
    selectedParentCompteId: number | null = null;
    listComptes(){
 
      this.compteService.getComptes().subscribe((res:any) =>{
        this.comptes=res
        console.log("reponse comptes",this.comptes)
       
      }
      )
    }
   


    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params => {
        const classeId = +params['id'];
        const selectedCompteId = +params['parent_compte_id']; // Récupérer l'ID du compte parent
    
        // Récupérer les détails de la classe depuis le service
        this.classeService.getClasse(classeId).subscribe(
          (classe) => {
            this.selectedClasse = classe;
            this.selectedClasseColor = this.selectedClasse ? CompteDetailsComponent.couleurs[(this.selectedClasse.id || 1) - 1] : CompteDetailsComponent.couleurs[0];
    
            // Charger les comptes de la classe avec l'ID correspondant
            this.fetchComptes(classeId); 
            
            // Utiliser l'ID du compte parent comme nécessaire
            console.log('ID du compte parent:', selectedCompteId);
          },
          (error) => {
            console.error('Erreur lors du chargement des détails de la classe', error);
          }
        );
      });
    }
    
      addCompte(selectedCompteId: number): void {
        // Vérifier si un compte est sélectionné
        if (selectedCompteId) {
          this.router.navigate(['/add'], { 
            queryParams: { 
              classe_id: this.selectedClasse?.id, 
              parent_compte_id: selectedCompteId  // Utiliser l'ID du compte sélectionné
            } 
          });
        } else {
          console.error('Aucun compte sélectionné.');
          // Gérer le cas où aucun compte n'est sélectionné
        }
      }
    

      fetchComptes(classeId: number): void {
        const url = `http://192.168.1.38:8080/api/v1/test/byClasse/${classeId}`;
        this.http.get<any[]>(url).subscribe(
          (comptes) => {
            console.log('Comptes for the classe:', comptes);
            this.comptes = comptes;
          },
          (error) => {
            console.error('Error loading comptes:', error);
          }
        );
      }
      
      
editCompte(id: number) {
 this.compteService.getCompte(id).subscribe(
   (compte) => {
     this.selectedCompte = compte;
         const dialogRef = this.dialog.open(EditDialogCompteComponent, {
           width: '300px',
           data: { ...this.selectedCompte } // Passez une copie des données pour éviter les problèmes de référence
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
     // Effectuez les actions nécessaires après la mise à jour de la classe
     this.router.navigate(['/comptes']);
   },
   (error) => {
     console.error('Error updating compte', error);
     // Affichez un message d'erreur
   }
 );
}

onCompteClick(parentId: number) {
  this.selectedParentCompteId = parentId;
  this.loadSubComptes(parentId);
}



// Objet pour stocker les sous-sous-comptes de chaque sous-compte ouvert
subSubComptesByCompteId: { [key: number]: Compte[] } = {};

// Fonction pour charger les sous-comptes récursivement
loadSubComptes(compteId: number): void {
  this.compteService.getComptesByCompteParentId(compteId).subscribe(
    (subComptes) => {
      console.log('Sub comptes for compteId:', compteId, subComptes);
      this.subComptesByCompteId[compteId] = subComptes;
      
      // Chargez les sous-sous-comptes pour chaque sous-compte
      subComptes.forEach((subCompte) => {
        this.loadSubSubComptes(subCompte.id);
      });
    },
    (error) => {
      console.error('Error fetching sub comptes:', error);
    }
  );
}
subComptesByCompteId: { [key: number]: Compte[] } = {};
  openCompteIds: number[] = [];

// Fonction pour charger les sous-sous-comptes
loadSubSubComptes(subCompteId: number): void {
  this.compteService.getComptesByCompteParentId(subCompteId).subscribe(
    (subSubComptes) => {
      console.log('Sub sub comptes for subCompteId:', subCompteId, subSubComptes);
      this.subSubComptesByCompteId[subCompteId] = subSubComptes;
    },
    (error) => {
      console.error('Error fetching sub sub comptes:', error);
    }
  );
}




// Initialisez un objet pour stocker les états d'ouverture des comptes
openCompteStates: { [compteId: number]: boolean } = {};

// Fonction pour ouvrir/fermer les sous-comptes
toggleSubComptes(compteId: number): void {
  // Vérifier si le compte est déjà ouvert
  const isOpen = this.openCompteStates[compteId];
  if (isOpen) {
    // Si oui, le fermer
    this.openCompteStates[compteId] = true;
  } else {
    // Sinon, l'ouvrir
    this.openCompteStates[compteId] = true;
    this.loadSubComptes(compteId); // Charger les sous-comptes si nécessaire
  }
}

// Fonction pour vérifier si un compte est ouvert
isCompteSelected(compteId: number): boolean {
  return this.openCompteStates[compteId] || false; // Retourne false si le compte n'existe pas dans l'objet
}

}
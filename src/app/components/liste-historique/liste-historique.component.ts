import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmComponent } from 'src/app/components/dialog-confirm/dialog-confirm.component';
import { Rule } from 'src/app/models/Rule.model';
import { Operation } from 'src/app/models/operation.model';
import { RuleService } from 'src/app/services/Rule.service';
import { HistoriqueService } from 'src/app/services/historique.service';


@Component({
  selector: 'app-liste-historique',
  templateUrl: './liste-historique.component.html',
  styleUrls: ['./liste-historique.component.css']
})
export class ListeHistoriqueComponent implements OnInit {
  operationLibellesCount: { [key: string]: [number, any] } = {}; // Définissez le type de votre objet ici

    constructor(private historiqueService: HistoriqueService,public dialog: MatDialog, private RuleService: RuleService,private _router: Router,
      private _activatedRoute: ActivatedRoute) { }
    Rules: Rule[] = [];
    lignes: any[] = [];
    ligne: any; // Ajoutez cette ligne pour déclarer la propriété 'ligne'

    ngOnInit(): void {
        this.getOperationLibellesCount();
    }

    getOperationLibellesCount(): void {
      // Appel de la méthode pour récupérer les détails des opérations
      this.historiqueService.getOperationLibellesCountFromHistoriques().subscribe(
          (data: any) => {
              // Stockage des données récupérées dans la variable operationLibellesCount
              this.operationLibellesCount = data;
              // Affichage des occurrences des libellés dans la console
              console.log('Occurrences des libellés:', this.operationLibellesCount);
  
              // Parcours des valeurs pour chaque libellé
              for (const libelle in this.operationLibellesCount) {
                  // Vérification si la propriété est propre à l'objet (évite les propriétés héritées)
                  if (this.operationLibellesCount.hasOwnProperty(libelle)) {
                      // Création d'un objet ligne pour stocker les valeurs de chaque ligne du tableau
                      const ligne = {
                        condition: libelle, // Stockage du libellé
                        
                          type: this.operationLibellesCount[libelle][1][0]?.type, // Récupération du type de la première opération
                          tauxTVA: this.operationLibellesCount[libelle][1][0]?.tauxTVA, // Récupération du taux de TVA de la première opération
                          code: this.operationLibellesCount[libelle][1][0]?.compte?.code,
                          description: this.operationLibellesCount[libelle][1][0]?.description,
                        
                      };
                      console.log('ligne :', ligne);
                      // Ajout de l'objet ligne à la variable lignes
                      this.lignes.push(ligne);
                  }
              }
          },
          // Gestion des erreurs en cas de problème lors de la récupération des données
          (error: any) => {
              console.error('Erreur lors de la récupération des occurrences des libellés:', error);
          }
      );
  }
  
  calculateAverage(operations: Operation[]): number {
    if (!operations || operations.length === 0) {
        return 0;
    }
    
    const totalMontant = operations.reduce((acc, operation) => acc + operation.montant, 0);
    return totalMontant / operations.length;
}

  
  
  loadRules(): void {
    this.RuleService.getRules().subscribe(Rules => {
      this.Rules = Rules;
    
    });
  }
  

  ADDrule(rule: Rule): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '300px',
      data: rule,
     
     
    });
    this.historiqueService.getOperationLibellesCountFromHistoriques().subscribe(
      (data: any) => {
          // Stockage des données récupérées dans la variable operationLibellesCount
          this.operationLibellesCount = data;
          // Affichage des occurrences des libellés dans la console
          console.log('Occurrences des libellés:', this.operationLibellesCount);

          // Parcours des valeurs pour chaque libellé
          for (const libelle in this.operationLibellesCount) {
              // Vérification si la propriété est propre à l'objet (évite les propriétés héritées)
              if (this.operationLibellesCount.hasOwnProperty(libelle)) {
                  // Création d'un objet ligne pour stocker les valeurs de chaque ligne du tableau
                  const ligne = {
                    condition: libelle, // Stockage du libellé
                    
                      type: this.operationLibellesCount[libelle][1][0]?.type, // Récupération du type de la première opération
                      tauxTVA: this.operationLibellesCount[libelle][1][0]?.tauxTVA, // Récupération du taux de TVA de la première opération
                      code: this.operationLibellesCount[libelle][1][0]?.compte?.code,
                      description: this.operationLibellesCount[libelle][1][0]?.description,
                    
                  };
                  console.log('ligne :', ligne);
                  // Ajout de l'objet ligne à la variable lignes
                  this.lignes.push(ligne);
              }
          }
      },
      // Gestion des erreurs en cas de problème lors de la récupération des données
      (error: any) => {
          console.error('Erreur lors de la récupération des occurrences des libellés:', error);
      }
  );
    rule=this.ligne
    console.log("rule :",rule);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.RuleService.create(rule).subscribe(
          () => {
            window.location.reload();
          },
          (error: HttpErrorResponse) => {
            console.error("Error add Rule:", error);
          }
        );
      }
    });
  
    console.log("Rule added successfully.");
   
    this.loadRules();
  
    this._router.navigate(['/historiques']);
  }
  

}

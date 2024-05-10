import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmComponent } from 'src/app/components/dialog-confirm/dialog-confirm.component';
import { Rule } from 'src/app/models/Rule.model';
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
    
    ngOnInit(): void {
        this.getOperationLibellesCount();
    }

    getOperationLibellesCount(): void {
      this.historiqueService.getOperationLibellesCountFromHistoriques().subscribe(
          (data: any) => {
              this.operationLibellesCount = data;
              console.log('Occurrences des libellés:', this.operationLibellesCount);
              
              // Affichage séparé des libellés, occurrences et objets opération
              for (const libelle in this.operationLibellesCount) {
                  if (this.operationLibellesCount.hasOwnProperty(libelle)) {
                      const occurrence = this.operationLibellesCount[libelle][0];
                      const operation = this.operationLibellesCount[libelle][1];
                      
                      console.log('Libellé:', libelle);
                      console.log('Occurrence:', occurrence);
                      console.log('Objet opération:', operation);
                  }
              }
          },
          (error: any) => {
              console.error('Erreur lors de la récupération des occurrences des libellés:', error);
          }
      );
  }
  
  loadRules(): void {
    this.RuleService.getRules().subscribe(Rules => {
      this.Rules = Rules;
    });
  }
  

  ADDrule(data:Rule) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '300px',
      data: data
       });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.RuleService.create(data).subscribe(
          () => {
            window.location.reload();
          },
          (error: HttpErrorResponse) => {
            console.error("Error add Rule:", error);
          }
        );
      }
    });
    console.log("Rule deleted successfully.");
    this.loadRules();

    this._router.navigate(['/historiques']);

  }

}

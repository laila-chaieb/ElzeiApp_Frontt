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
  operationLibellesCount: { [key: string]: { [montant: string]: { [date: string]: [number, Operation[]] } } } = {};
  lignes: any[] = [];
  Rules: Rule[] = [];
  constructor(
    private historiqueService: HistoriqueService,
    public dialog: MatDialog,
    private ruleService: RuleService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOperationLibellesCount();
  }

  getOperationLibellesCount(): void {
    this.historiqueService.getOperationLibellesCountFromHistoriques().subscribe(
      (data: any) => {
        this.operationLibellesCount = data;
        console.log('Occurrences des libellés:', this.operationLibellesCount);

        for (const libelle in this.operationLibellesCount) {
          if (this.operationLibellesCount.hasOwnProperty(libelle)) {
            const montantMap = this.operationLibellesCount[libelle];

            for (const montant in montantMap) {
              if (montantMap.hasOwnProperty(montant)) {
                const dateMap = montantMap[montant];

                for (const date in dateMap) {
                  if (dateMap.hasOwnProperty(date)) {
                    const details = dateMap[date];
                    const count = details[0];
                    const operations = details[1];

                    for (const operation of operations) {
                      const ligne = {
                        condition: libelle,
                        montant: montant,
                        date: date,
                        type: operation.type,
                        tauxTVA: operation.tauxTVA,
                        code: operation.compte?.code,
                        description: operation.description
                      };
                      console.log('ligne :', ligne);
                      this.lignes.push(ligne);
                    }
                  }
                }
              }
            }
          }
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des occurrences des libellés:', error);
      }
    );
  }

  loadRules(): void {
    this.ruleService.getRules().subscribe(rules => {
      this.Rules = rules;
    });
  }

  ADDrule(libelle: string, montant: string, date: string): void {
    const operationDetails = this.operationLibellesCount[libelle][montant][date][1][0];
    const rule: Rule = {
      condition: "libelle.contains(\""+libelle+"\")",
      type: operationDetails.type,
      tauxTVA: operationDetails.tauxTVA !== null ? operationDetails.tauxTVA : 0,
      code: operationDetails.compte?.code,
      description: operationDetails.description
    };

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '300px',
      data: rule
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ruleService.create(rule).subscribe(
          () => {
            this.historiqueService.deleteOperationsByLibelle(libelle).subscribe(
              () => {
                console.log("Operations with the same libelle deleted successfully.");
                window.location.reload();
              },
              (error: HttpErrorResponse) => {
                console.error("Error deleting operations by libelle:", error);
              }
            );
          },
          (error: HttpErrorResponse) => {
            console.error("Error adding Rule:", error);
          }
        );
      }
    });

    console.log("Rule added successfully.");
    this.loadRules();
    this.router.navigate(['/historiques']);
  }
}

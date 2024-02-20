import { Component, OnInit } from '@angular/core';
import { CompteService } from '../../services/compte.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { Compte } from '../../models/compte.model';
import { Classe } from '../../models/classe.model';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, catchError, filter, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-tableau-comptes',
  templateUrl: './tableau-comptes.component.html',
  styleUrls: ['./tableau-comptes.component.css']
})
export class TableauComptesComponent implements OnInit {
  comptesByClasse: { [classeId: number]: Compte[] } = {}; // Assurez-vous de l'initialiser correctement

  classes: Classe[] = [];
  comptes: Compte[] = [];

  constructor(
    private compteService: CompteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private classeService: ClasseService,
    private http: HttpClient
  ) {}

  private static readonly couleurs = [
    '#B1FA6B', '#90F88C', '#FFB86A', '#FDE919', '#78E6E1', '#5ECAFE', '#B591E6', '#EE81FE', '#aaa19f'
  ];
  dataSource: MatTableDataSource<Classe> = new MatTableDataSource<Classe>([]);

  listClasses() {
    this.classeService.getClasses().subscribe((res: Classe[]) => {
      this.classes = this.assignColorsToClasses(res);
      this.dataSource.data = this.classes; // Assurez-vous de mettre à jour la source de données ici
      console.log("Classes:", this.classes);
    });
  }
  listComptes(){
 
    this.compteService.getComptes().subscribe((res:any) =>{
      this.comptes=res
      console.log("reponse",this.comptes)
     
    }
    )
  }

  getCardColor(index: number): string {
    const colorIndex = index % TableauComptesComponent.couleurs.length;
    return TableauComptesComponent.couleurs[colorIndex];
  }

  assignColorsToClasses(classes: Classe[]): Classe[] {
    return classes.map((classe, index) => {
      return { ...classe, couleur: TableauComptesComponent.couleurs[index] };
    });
  }

  
  ngOnInit(): void {
    // Charger toutes les classes
    this.classeService.getClasses().subscribe(
      (classes: Classe[]) => {
        this.classes = classes;
        this.dataSource.data = this.classes;
        
        // Pour chaque classe, charger les comptes
        this.classes.forEach(classe => {
          if (classe.id !== undefined) {
            this.fetchComptes(classe.id);
          }
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des classes', error);
      }
    );
  }
  

  fetchComptes(classeId: number): void {
    this.compteService.getComptesByClasseId(classeId).subscribe(
      (comptes) => {
        this.comptesByClasse[classeId] = comptes;
      },
      (error) => {
        console.error('Erreur lors du chargement des comptes', error);
      }
    );
  }



  
  }
  
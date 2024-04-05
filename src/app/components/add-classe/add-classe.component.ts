import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Classe } from 'src/app/models//classe.model';
import { ClasseService } from 'src/app/services/classe.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-classe',
  templateUrl: './add-classe.component.html',
  styleUrls: ['./add-classe.component.css'],
  providers: [MatSnackBar]
})
export class AddClasseComponent implements OnInit {
  Classe: Classe = {
    description: '',
    nom: '',
    numcl: '',
  };
  classes:any;
  text = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]')]);
  successMessage: string | null = null;
  errorMessage: string | null = null;

  

  constructor(
    private classeService: ClasseService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  ngOnInit(): void {
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('id');
    if (isIdPresent) {
      const idParam = this._activatedRoute.snapshot.paramMap.get('id');
      if (idParam !== null) {
        const id = +idParam;
        this.classeService.getClasse(id).subscribe(
          data => {
            this.Classe = data;
          },
          error => {
            console.log('Une erreur s\'est produite lors de la récupération de la classe :', error);
            // Gérer l'erreur (afficher un message d'erreur, rediriger, etc.)
          }
        );
      }
    }
  }
  listClasses(){
 
    this.classeService.getClasses().subscribe((res:any) =>{
      this.classes=res
      console.log("reponse classes",this.classes)
     
    }
    )
  }

  saveClasse(): void {
    const data = {
      description: this.Classe.description,
      nom: this.Classe.nom,
      numcl: this.Classe.numcl,
    };

    this.classeService.create(data).subscribe(
      (res) => {
        console.log('Classe créée:', res);
        this.successMessage = 'Classe créée avec succès.';
        this.errorMessage = null;
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de la création de la classe', error);
        this.errorMessage = 'Erreur lors de la création de la classe.';
        this.successMessage = null;
      }
    );
  }

  resetForm(): void {
    this.Classe = { description: '', nom: '', numcl: '' };
  }
}


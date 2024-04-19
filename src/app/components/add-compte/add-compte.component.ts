import { Component, OnInit } from '@angular/core';
import { Compte } from 'src/app/models/compte.model';
import { CompteService } from 'src/app/services/compte.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-compte',
  templateUrl: './add-compte.component.html',
  styleUrls: ['./add-compte.component.css']
})
export class AddCompteComponent implements OnInit {
  comptes: any;
  Compte: Compte = {
    id: 0,
    libele: '',
    code: '',
    description: '',
    classe_id: 0,

  };
  submitted = false;
  successMessage: string = '';
  invalidInput: boolean = false;
  maxLength: number = 0;
  constructor(
    private CompteService: CompteService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
 
  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      const classe_id = +params['classe_id'];
      const parent_compte_id = +params['parent_compte_id'];
  
      console.log('Classe ID:', classe_id);
      console.log('Parent Compte ID:', parent_compte_id);
  
      this.Compte = new Compte();
  
      this.Compte.classe_id = classe_id;
      this.Compte.parent_compte_id = parent_compte_id;
  
      let parentCode: string = ''; // Variable pour stocker le code du parent
  
      // Récupérer le code du compte parent s'il existe
      if (parent_compte_id) {
        this.CompteService.getCompte(parent_compte_id).subscribe(
          parentCompte => {
            parentCode = parentCompte.code; // Stocker le code du parent
            // Concaténer un chiffre supplémentaire pour le nouveau compte
            this.Compte.code = parentCode + '1'; // Par exemple, vous pouvez ajouter '1' pour le premier compte fils
            // Vous pouvez également ajouter une logique pour générer le chiffre supplémentaire en fonction du nombre de sous-comptes déjà existants, si nécessaire
          },
          error => {
            console.error('Erreur lors de la récupération du code du compte parent :', error);
          }
        );
      } else {
        // Si aucun parent n'est défini, la longueur maximale est juste 1
        this.maxLength = 2;
        console.log('MaxLength (Default):', this.maxLength);
      }
    });
  }
  
 

 
  saveCompte() {
    const classeId = this.Compte.classe_id;
    const parentId = this.Compte.parent_compte_id;

    this.Compte.classe_id = classeId;
    this.Compte.parent_compte_id = parentId;

    

    // Enregistrer le compte avec les champs correctement remplis
    this.CompteService.create(this.Compte).subscribe(
        (res) => {
            console.log('Compte créé:', res);
            this._router.navigate(['/Comptes']);
        },
        (error) => {
            console.error('Erreur lors de la création du compte', error);
        }
    );
}




createCompte() {
    this.CompteService.create(this.Compte).subscribe(
        (res) => {
            console.log('Compte créé:', res);
            this._router.navigate(['/Comptes']);
        },
        (error) => {
            console.error('Erreur lors de la création du compte', error);
        }
    );
}

  listComptes() {
    this.CompteService.getComptes().subscribe((res: any) => {
      this.comptes = res;
      console.log('reponse', this.comptes);
    });
  }
  allowOnlyOneDigit(event: any) {
    // Récupère le caractère saisi
    const inputChar = event.key;
    console.log('Input char:', inputChar);
  
    // Vérifie si le caractère est un chiffre
    if (!isNaN(inputChar) && inputChar !== ' ') {
      console.log('Digit entered:', inputChar);
      // Si le champ ne contient pas déjà un chiffre, autorise la saisie
      if (!this.Compte.code || this.Compte.code.length === 0) {
        console.log('Code does not contain a digit, allowing input.');
        // Ajoute le chiffre saisi à la valeur existante du champ
        this.Compte.code = inputChar;
      } else {
        console.log('Code already contains a digit, preventing input.');
        event.preventDefault();
      }
    } else {
      console.log('Non-digit character entered, preventing input.');
      // Bloque la saisie de caractères autres que des chiffres
      event.preventDefault();
    }
  }
  
  
  
  }
  
  
  
  
  


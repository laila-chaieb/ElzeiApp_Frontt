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
  
      // Récupérer le code du compte parent s'il existe
      if (parent_compte_id) {
        this.CompteService.getCompte(parent_compte_id).subscribe(
          parentCompte => {
            this.Compte.code = parentCompte.code;
          },
          error => {
            console.error('Erreur lors de la récupération du code du compte parent :', error);
          }
        );
      }
    });
  
    // Votre code existant pour récupérer un compte existant si l'ID est présent
    const isIdPresent = this._activatedRoute.snapshot.paramMap.has('id');
    if (isIdPresent) {
      const idParam = this._activatedRoute.snapshot.paramMap.get('id');
      if (idParam !== null) {
        const id = +idParam;
        this.CompteService.getCompte(id).subscribe(
          data => {
            this.Compte = data;
          },
          error => {
            console.log('Une erreur s\'est produite lors de la récupération du Compte :', error);
          }
        );
      }
    }
  }
  

 

 /* saveCompte() {
    console.log('Contenu du compte avant soumission :', this.Compte);
  
    // Récupérer l'ID de la classe associée au compte depuis l'objet Compte
    const classeId = this.Compte.classe_id;
  
    // Récupérer l'ID du compte parent associé au compte depuis l'objet Compte
    const parentId = this.Compte.parent_compte_id;
  
    // Remplir automatiquement le champ "classe_id" dans l'objet "Compte"
    this.Compte.classe_id = classeId;
  
    // Remplir automatiquement le champ "parent_compte_id" dans l'objet "Compte"
    this.Compte.parent_compte_id = parentId;
  
    // Enregistrer le compte avec les champs correctement remplis
    this.CompteService.create(this.Compte).subscribe(
      (res) => {
        console.log('Compte créé:', res);
        // Rediriger vers la page liste comptes après l'enregistrement
        this._router.navigate(['/Comptes']);
      },
      (error) => {
        console.error('Erreur lors de la création du compte', error);
      }
    );
  }*/
  saveCompte() {
    const classeId = this.Compte.classe_id;
    const parentId = this.Compte.parent_compte_id;

    this.Compte.classe_id = classeId;
    this.Compte.parent_compte_id = parentId;

    // Récupérer le code du compte parent s'il existe et l'ajouter aux données à envoyer
    if (parentId) {
        this.CompteService.getCompte(parentId).subscribe(
            parentCompte => {
                this.Compte.code = parentCompte.code;
                this.createCompte();
            },
            error => {
                console.error('Erreur lors de la récupération du code du compte parent :', error);
            }
        );
    } else {
        this.createCompte();
    }
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
    // Empêche la saisie de caractères autres que des chiffres
    const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const inputChar = String.fromCharCode(event.charCode);
  
    if (!allowedChars.includes(inputChar)) {
      event.preventDefault();
    }
  
    // Si le champ contient déjà un chiffre, empêche la saisie d'un autre
    if (this.Compte.code && this.Compte.code.length >= 1) {
      event.preventDefault();
    }
  }
  
}

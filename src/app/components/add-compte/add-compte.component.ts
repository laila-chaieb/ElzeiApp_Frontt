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
            // Convertir le code en chaîne de caractères et obtenir sa longueur
            const parentCodeLength = parentCode.toString().length;
            // Calculer la longueur maximale en ajoutant 1 à la longueur du code du parent
            this.maxLength = parentCodeLength + 1;
            console.log('MaxLength (Computed):', this.maxLength);
  
            // Maintenant que nous avons calculé la longueur maximale, nous pouvons définir le code du parent dans le Compte
            this.Compte.code = parentCode;
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
    console.log('Parent Compte code:', this.Compte.code);

    // Capturer la valeur entrée dans le champ de code et la stocker dans this.Compte.code
    const codeInput = (document.getElementById('code') as HTMLInputElement).value.trim();
  
    // Utiliser la valeur modifiée du code si elle existe, sinon utiliser le code du compte parent
    this.Compte.code = codeInput || this.Compte.code;
    console.log('Parent Compte code:', this.Compte.code);

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
  }

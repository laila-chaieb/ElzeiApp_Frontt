import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    parent_compte_id: null,
    classeNumcl: '',
    classeNom: '',
    Classe: {
      id: 0,
      description: '',
      nom: '',
      numcl: ''
    }
  };
  myForm!: FormGroup;

  submitted = false;
  successMessage: string = '';
  invalidInput: boolean = false;
  maxLength: number = 0;

  constructor(
    private CompteService: CompteService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
      parent_compte_id: [{ value: '', disabled: true }],
      libele: ['', Validators.required],
      classe_id: [{ value: '', disabled: true }],
      description: ['', Validators.required]
    });

    this.myForm.controls['code'].valueChanges.subscribe((value: any) => {
      if (typeof value === 'string') {
        const trimmedValue = value.trim();
        if (trimmedValue.length > this.maxLength) {
          this.myForm.controls['code'].setValue(trimmedValue.slice(0, this.maxLength), { emitEvent: false });
        }
      }
    });

    this._activatedRoute.queryParams.subscribe(params => {
      const classe_id = +params['classe_id'] || 0;
      const parent_compte_id = params['parent_compte_id'] !== undefined ? +params['parent_compte_id'] : null;

      console.log('Classe ID:', classe_id);
      console.log('Parent Compte ID:', parent_compte_id);

      this.Compte.classe_id = classe_id;
      this.Compte.parent_compte_id = parent_compte_id;

      if (parent_compte_id) {
        this.CompteService.getCompte(parent_compte_id).subscribe(
          parentCompte => {
            const parentCode = parentCompte.code;
            const parentCodeLength = parentCode ? parentCode.toString().length : 0;
            this.maxLength = parentCodeLength + 1;
            console.log('MaxLength (Computed):', this.maxLength);

            this.myForm.controls['code'].setValidators([Validators.required, Validators.maxLength(this.maxLength)]);
            this.myForm.controls['code'].updateValueAndValidity();
            this.myForm.patchValue({ code: parentCode });
          },
          error => {
            console.error('Erreur lors de la récupération du code du compte parent :', error);
          }
        );
      } else {
        this.maxLength = 2;
        console.log('MaxLength (Default):', this.maxLength);
        this.myForm.controls['code'].setValidators([Validators.required, Validators.maxLength(this.maxLength)]);
        this.myForm.controls['code'].updateValueAndValidity();
      }

      this.myForm.patchValue({
        parent_compte_id: parent_compte_id,
        classe_id: classe_id
      });
    });
  }

  saveCompte() {
    if (this.myForm.invalid) {
      this.invalidInput = true;
      return;
    }

    const formValues = this.myForm.value;
    this.Compte.code = formValues.code;
    this.Compte.libele = formValues.libele;
    this.Compte.description = formValues.description;
    this.Compte.classe_id = this.Compte.classe_id; // Assurez-vous que classe_id est bien assigné
    this.Compte.parent_compte_id = this.Compte.parent_compte_id; // Assurez-vous que parent_compte_id est bien assigné

    // Créez une copie de l'objet Compte sans la propriété parent_compte_id si elle est null
    const compteData: any = { ...this.Compte };
    if (this.Compte.parent_compte_id === null) {
      delete compteData.parent_compte_id;
    }

    this.CompteService.create(compteData).subscribe(
      res => {
        console.log('Compte créé:', res);
        this._router.navigate(['/Comptes']);
      },
      error => {
        console.error('Erreur lors de la création du compte', error);
      }
    );
  }
}

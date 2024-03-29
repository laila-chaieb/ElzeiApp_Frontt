// operation.model.ts

import { Compte } from "./compte.model";

export class Operation {
    id: number;
    libelle: string;
    montant: number;
    type: string;
    dateOP: Date;
    dateVal: Date;
    description: string;
    status: string;
    justificatif: any;  // Ajoutez cette ligne pour l'attribut justificatif
    tauxTVA:  number | null;
    tvadeductible: string| null;
    classe_id:number;
    compte: Compte;
    [key: string]: any;
    
       // Ajoutez d'autres attributs au besoin
  
    constructor(
      id: number,
      libelle: string,
      montant: number,
      type: string,
      dateOP: Date,
      dateVal: Date,
      description: string,
      status: string,
      tauxTVA: number,
      tvadeductible: string,
      compte: Compte,
      classe_id:any,
      
      // Ajoutez d'autres attributs au besoin
    ) {
      
      this.id = id;
      this.libelle = libelle;
      this.montant = montant;
      this.type = type;
      this.dateOP = dateOP;
      this.dateVal = dateVal;
      this.description= description;
      this.status = status;
      this.tauxTVA = tauxTVA !== null ? tauxTVA : 1.0;
      this.tvadeductible= tvadeductible;
      this.classe_id= classe_id;
      this.compte= compte;
      // Initialisez d'autres attributs au besoin
    }
  }
  
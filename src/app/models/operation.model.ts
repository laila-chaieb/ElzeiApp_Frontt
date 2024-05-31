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
    justificatif: any;  
    tauxTVA: number | null;
    tvadeductible: string | null;
    classe_id: number;
    compte: Compte;
    [key: string]: any;

    constructor(
      id: number,
      libelle: string,
      montant: number,
      type: string,
      dateOP: Date,
      dateVal: Date,
      description: string,
      status: string,
      tauxTVA: number | null,
      tvadeductible: string | null,
      compte: Compte,
      classe_id: any,
    ) {
      this.id = id;
      this.libelle = libelle;
      this.montant = montant;
      this.type = type;
      this.dateOP = dateOP;
      this.dateVal = dateVal;
      this.description = description;
      this.status = status;
      this.tauxTVA = tauxTVA;
      this.tvadeductible = tvadeductible;
      this.classe_id = classe_id;
      this.compte = compte;
    }
}

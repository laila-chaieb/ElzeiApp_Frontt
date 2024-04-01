export class Compte {
  id?: any;
  code?: String;
  libele?: string;
  classe_id?: number;
  description?: string;
  parent_compte_id?:number
  subComptes: Compte[] = []; // Ajoutez la propriété subComptes

}

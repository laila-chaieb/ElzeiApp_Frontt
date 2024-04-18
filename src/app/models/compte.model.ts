import { Classe } from 'src/app/models/classe.model';

export class Compte {
  id?: any;
  code?: any;
  libele?: string;
  classe_id?: number;
  description?: string;
  parent_compte_id?:number
  classeNumcl?: string;
  classeNom?: string;
  Classe?: Classe;
  subComptes?: Compte[]; // Assurez-vous d'ajouter le '?' pour indiquer que cette propriété est facultative

}

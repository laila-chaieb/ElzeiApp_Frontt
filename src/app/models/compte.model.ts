import { Classe } from 'src/app/models/classe.model';

export class Compte {
  id: number;
  code: any;
  libele: string;
  classe_id: number;
  description: string;
  parent_compte_id: number | null;
  classeNumcl: string;
  classeNom: string;
  Classe: Classe;
  subComptes?: Compte[]; // Assurez-vous d'ajouter le '?' pour indiquer que cette propriété est facultative

  constructor(
    id: number,
    code: any,
    libele: string,
    classe_id: number,
    description: string,
    parent_compte_id: number | null,
    classeNumcl: string,
    classeNom: string,
    Classe: Classe,
    subComptes?: Compte[]
  ) {
    this.id = id;
    this.code = code;
    this.libele = libele;
    this.classe_id = classe_id;
    this.description = description;
    this.parent_compte_id = parent_compte_id;
    this.classeNumcl = classeNumcl;
    this.classeNom = classeNom;
    this.Classe = Classe;
    this.subComptes = subComptes;
  }
}

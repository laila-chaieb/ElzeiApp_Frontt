import { Operation } from "./operation.model";

export class Historique {
  id: number;  // Identifiant unique de l'historique
  operation: { id: number }; // Identifiant de l'opération associée à cet historique
  compteAffecte: string; // Le compte affecté par cette opération

  constructor(id: number, operation: { id: number }, compteAffecte: string) {
    this.id = id;
    this.operation = operation;
    this.compteAffecte = compteAffecte;
    // Initialisez d'autres propriétés au besoin
  }
}
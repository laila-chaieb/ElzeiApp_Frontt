import { Operation } from "./operation.model";

export interface Historique {
    id?: number;  // Identifiant unique de l'historique
    operation: Operation; // Identifiant de l'opération associée à cet historique
    date: Date; // Date de l'historique
    compteAffecte: string; // Le compte affecté par cette opération
    // Autres propriétés d'historique si nécessaire
  }
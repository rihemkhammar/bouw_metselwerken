// Import des services spécifiques
import { signupService } from "./client/signupService.js";

export const clientService = {
  // Expose la méthode signup depuis signupService
  registerClient: signupService.createPendingClient,

  // Autres méthodes client à ajouter plus tard :
  // getClientById, updateClientProfile, deleteClient, etc.
};
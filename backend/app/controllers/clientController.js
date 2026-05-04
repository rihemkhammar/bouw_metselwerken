// Import des contrôleurs spécifiques
import { clientSignupController } from "./client/clientSignupController.js";

export const clientController = {
  // Expose le handler signup
  signup: clientSignupController.handleSignup,

  
};
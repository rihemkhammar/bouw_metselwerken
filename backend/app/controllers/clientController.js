<<<<<<< HEAD
// Import des contrôleurs spécifiques
import { clientSignupController } from "./client/clientSignupController.js";

export const clientController = {
  // Expose le handler signup
  signup: clientSignupController.handleSignup,

  
=======
import { clientSignupController } from "./client/clientSignupController.js";
import { clientProfileController } from "./client/clientProfileController.js";
import { clientProjectController } from "./client/clientProjectController.js"; 
import { clientProjectDetailController } from "./client/Clientprojectdetailcontrolle.js";
import { serviceController } from "./client/Servicecontroller.js";


export const clientController = {
  signup: clientSignupController.handleSignup,
  getProfile: clientProfileController.getProfile,
  getClientProjects: clientProjectController.handleGetClientProjects, 
  getProjectDetail: clientProjectDetailController.getProjectDetail, 
  getAllServices: serviceController.getAllServices,
>>>>>>> origin/GuestPage_Rihem
};
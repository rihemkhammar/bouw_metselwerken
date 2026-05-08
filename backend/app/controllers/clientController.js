import { clientSignupController } from "./client/clientSignupController.js";
import { clientProfileController } from "./client/clientProfileController.js";
import { clientProjectController } from "./client/clientProjectController.js"; 

export const clientController = {
  signup: clientSignupController.handleSignup,
  getProfile: clientProfileController.getProfile,
  getClientProjects: clientProjectController.handleGetClientProjects, 
};
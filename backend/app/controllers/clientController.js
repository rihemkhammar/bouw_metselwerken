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
};
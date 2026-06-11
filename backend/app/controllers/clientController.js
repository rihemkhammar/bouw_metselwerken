import { clientSignupController } from "./client/clientSignupController.js";
import { clientProfileController } from "./client/clientProfileController.js";
import { clientProjectController } from "./client/clientProjectController.js"; 
import { clientProjectDetailController } from "./client/Clientprojectdetailcontrolle.js";
import { serviceController } from "./client/Servicecontroller.js";
import { uploadDocumentController } from "./client/uploadDocumentController.js";


export const clientController = {
  signup: clientSignupController.handleSignup,
  getProfile: clientProfileController.getProfile,
  getClientProjects: clientProjectController.handleGetClientProjects, 
  getProjectDetail: clientProjectDetailController.getProjectDetail, 
  getAllServices: serviceController.getAllServices,
  uploadDocument: uploadDocumentController.uploadDocument,
  getProjectUpdates: clientProjectDetailController.getProjectUpdates
  
};
import { signupService }              from "./client/signupService.js";
import { clientProfileService }       from "./client/ClientprofileService.js";
import { clientProjectService }       from "./client/clientProjectService.js";
import { clientProjectDetailService } from "./client/Clientprojectdetailservice.js";
import { serviceService }             from "./client/Serviceservice.js";
import { uploadDocumentService }      from "./client/uploadDocumentService.js";

export const clientService = {
  registerClient:    signupService.registerClient,
  getProfileById:    clientProfileService.getProfileById,
  updateProfileById: clientProfileService.updateProfileById,   
  updatePassword:    clientProfileService.updatePassword,
  getClientProjects: clientProjectService.getClientProjects,
  getProjectDetail:  clientProjectDetailService.getProjectDetail,
  getAllServices:     serviceService.getAllServices,
  uploadDocument:    uploadDocumentService.uploadDocument,
  getProjectUpdates: clientProjectDetailService.getProjectUpdates,
};
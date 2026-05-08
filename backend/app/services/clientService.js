import { signupService } from "./client/signupService.js";
import { clientProfileService } from "./client/ClientprofileService.js";
import { clientProjectService } from "./client/clientProjectService.js";

export const clientService = {
  registerClient: signupService.registerClient,
  getProfileById: clientProfileService.getProfileById,
  getClientProjects: clientProjectService.getClientProjects,

};
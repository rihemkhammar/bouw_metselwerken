import { signupService } from "./client/signupService.js";
import { clientProfileService } from "./client/ClientprofileService.js";

export const clientService = {
  registerClient: signupService.registerClient,
  getProfileById: clientProfileService.getProfileById,
};
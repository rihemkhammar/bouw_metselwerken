import { clientSignupController } from "./client/clientSignupController.js";
import { clientProfileController } from "./client/clientProfileController.js";

export const clientController = {
  signup: clientSignupController.handleSignup,
  getProfile: clientProfileController.getProfile,
};
import { Router } from "express";
import { clientController } from "../controllers/clientController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { upload } from "../configs/multer.js";

const router = Router();


// Routes publiques
router.post("/signup", clientController.signup);
router.get("/services", 
  authenticate,
  authorizeRoles("CLIENT"), 
   clientController.getAllServices
);
// Profil client
router.get(
  "/:userId/profile",
  authenticate,
  authorizeRoles("CLIENT"),
  clientController.getProfile
);
//project
router.get(
  "/:userId/projects",
  authenticate,
  authorizeRoles("CLIENT"),
  clientController.getClientProjects
);
router.get(
  "/:userId/projects/:projectId",
  authenticate,
  authorizeRoles("CLIENT"),
  clientController.getProjectDetail
);

// Updates
router.get(
  "/:userId/projects/:projectId/updates",
  authenticate,
  authorizeRoles("CLIENT"),
  clientController.getProjectUpdates
);

// Upload document
router.post(
  "/:userId/projects/:projectId/documents",
  authenticate,
  authorizeRoles("CLIENT"),
  upload.single("file"),
  clientController.uploadDocument
);


export default router;
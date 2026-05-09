import { Router } from "express";
import { clientController } from "../controllers/clientController.js";
<<<<<<< HEAD
=======
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
>>>>>>> origin/GuestPage_Rihem

const router = Router();

// Routes publiques
router.post("/signup", clientController.signup);
<<<<<<< HEAD
;
=======

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
router.get("/services", 
  authenticate,
  authorizeRoles("CLIENT"), 
   clientController.getAllServices
);
>>>>>>> origin/GuestPage_Rihem

export default router;
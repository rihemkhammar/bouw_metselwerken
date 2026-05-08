import { Router } from "express";
import { clientController } from "../controllers/clientController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = Router();

// Routes publiques
router.post("/signup", clientController.signup);

// Profil client
router.get(
  "/:userId/profile",
  authenticate,
  authorizeRoles("CLIENT"),
  clientController.getProfile
);

export default router;
import express from "express";
import { createChef, fetchChefs , fetchClients} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";


const router = express.Router();

router.post(
  "/chefs/create",
  authenticate,
  authorizeRoles("ADMIN"),
  createChef
);
router.get(
  "/chefs",
  authenticate,
  authorizeRoles("ADMIN"),
  fetchChefs
);
router.get(
"/clients",
  authenticate,
  authorizeRoles("ADMIN"),
  fetchClients
);

export default router;
import { Router } from "express";
import { clientController } from "../controllers/clientController.js";

const router = Router();

// Routes publiques
router.post("/signup", clientController.signup);

export default router;
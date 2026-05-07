import { Router } from "express";
import { submitGuestRequest } from "../controllers/guestController.js";

const router = Router();
router.post("/contact", submitGuestRequest);
export default router;
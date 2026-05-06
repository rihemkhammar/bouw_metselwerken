import express from "express";
import { createChef } from "../controllers/adminController.js";

const router = express.Router();

router.post("/chefs/create", createChef);
export default router;
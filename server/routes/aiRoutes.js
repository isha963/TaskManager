import express from "express";
import { generateTaskPlan } from "../controllers/aiController.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/generate-plan", protect, generateTaskPlan);

export default router;

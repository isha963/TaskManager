import express from "express";
import { generateTaskPlan, approvePlan } from "../controllers/aiController.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/generate-plan", protect, generateTaskPlan);
router.post("/approve-plan", protect, approvePlan);
export default router;

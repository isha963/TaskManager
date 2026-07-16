import express from "express";
import {createTask, getAllTasks,getTaskById,updateTask} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
export default router;
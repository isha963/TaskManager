import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
  });
});
export default router;
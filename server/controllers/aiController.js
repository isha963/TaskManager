import asyncHandler from "express-async-handler";
import { generateWithGemini } from "../services/geminiService.js";

export const generateTaskPlan = asyncHandler(async (req, res) => {
  const { goal, duration, hoursPerDay } = req.body;

  if (!goal || !duration || !hoursPerDay) {
    return res.status(400).json({
      success: false,
      message: "Please provide goal, duration and hours per day",
    });
  }

  const prompt = `
    Create a practical study plan.

    Goal: ${goal}
    Duration: ${duration} days
    Available study time: ${hoursPerDay} hours per day

    Break the goal into manageable daily tasks.
  `;

  const result = await generateWithGemini(prompt);

  res.status(200).json({
    success: true,
    plan: result,
  });
});

import asyncHandler from "express-async-handler";
import { generateWithGemini } from "../services/geminiService.js";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import { randomBytes } from "crypto";
import PlanApproval from "../models/PlanApproval.js";


export const generateTaskPlan = asyncHandler(async (req, res) => {
  const { goal, duration, hoursPerDay, experienceLevel } = req.body;
  const allowedLevels = ["Beginner", "Intermediate", "Advanced"];
  // Validate input

  if (!allowedLevels.includes(experienceLevel)) {
    return res.status(400).json({
      success: false,
      message: "please enter correct experience level",
    });
  }

  if (
    typeof goal !== "string" ||
    !goal.trim() ||
    !Number.isInteger(Number(duration)) ||
    Number(duration) < 1 ||
    Number(duration) > 90 ||
    !Number.isFinite(Number(hoursPerDay)) ||
    Number(hoursPerDay) <= 0 ||
    Number(hoursPerDay) > 24
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid goal, duration (1–90 days), and hours per day (up to 24).",
    });
  }

  // Get today's date in India
  const startDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  // Calculate the final date of the plan
  const [year, month, day] = startDate.split("-").map(Number);

  const endDate = new Date(
    Date.UTC(year, month - 1, day + Number(duration) - 1),
  )
    .toISOString()
    .slice(0, 10);

  const prompt = `
    Create a practical and achievable task plan.

    Goal: ${goal.trim()}
    Start date: ${startDate}
    Duration: ${duration} days
    End date: ${endDate}
    Available time per day: ${hoursPerDay} hours
    Experience level: ${experienceLevel}

    Instructions:
    1. Generate multiple main tasks per day when the workload requires it.
    2. Distribute tasks realistically across the available days.
    3. Keep the total estimated workload within the available hours per day.
    4. Give every task a clear and specific title.
    5. Include a useful description for every task.
    6. Assign priority as Low, Medium, or High.
    7. Give every task a dueDate in YYYY-MM-DD format.
    8. Every dueDate must fall between ${startDate} and ${endDate}, inclusive.
    9. Break each main task into actionable subtasks.
    10. Set completed to false for every generated subtask.
    11. Avoid duplicate or repetitive tasks.
    12. Return only the structured JSON matching the required schema.
    13. Adapt the complexity of tasks to the user's experience level.
    14. For Beginner, focus on fundamentals and guided practice.
    15. For Intermediate, focus on practical implementation and problem-solving.
    16. For Advanced, focus on complex concepts, optimization and architectural trade-offs.
  `;

  let result;
let approvalToken;
  try {
    result = await generateWithGemini(prompt);
    approvalToken = randomBytes(32).toString("hex");

    await PlanApproval.create({
      user: req.user._id,
      token: approvalToken,
    });
  } catch (error) {
    if (error.message?.includes("AI daily request limit reached")) {
      return res.status(429).json({
        success: false,
        message: error.message,
        
      });
    }

    return res.status(503).json({
      success: false,
      message: "AI service is temporarily unavailable. Please try again later.",
    });
  }

  res.status(200).json({
    success: true,
    plan: result,
    approvalToken,
  });
});

export const approvePlan = asyncHandler(async (req, res) => {
  const { tasks, approvalToken } = req.body;
  if (!approvalToken || typeof approvalToken !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing approval token.",
    });
  }

  

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one task.",
    });
  }

  
  for (const task of tasks) {
    if (!task || typeof task !== "object" || Array.isArray(task)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task data.",
      });
    }

    const validSubtasks =
      Array.isArray(task.subtasks) &&
      task.subtasks.every(
        (subtask) =>
          subtask &&
          typeof subtask.title === "string" &&
          subtask.title.trim() !== "" &&
          typeof subtask.completed === "boolean",
      );

    const validDate =
      typeof task.dueDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) &&
      !Number.isNaN(Date.parse(task.dueDate)) &&
      new Date(task.dueDate).toISOString().slice(0, 10) === task.dueDate;

    if (
      typeof task.title !== "string" ||
      !task.title.trim() ||
      typeof task.description !== "string" ||
      !task.description.trim() ||
      !["Low", "Medium", "High"].includes(task.priority) ||
      !validDate ||
      !validSubtasks
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more tasks contain invalid data.",
      });
    }
  }
  
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const updatedApproval = await PlanApproval.findOneAndUpdate(
      {
        token: approvalToken,
        user: req.user._id,
        used: false,
      },
      {
        $set: { used: true },
      },
      {
        new: true,
        session,
      },
    );

    if (!updatedApproval) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "This plan has already been approved or the token is invalid.",
      });
    }

    const savedTasks = [];

    for (const task of tasks) {
     

    
      const newTask = await Task.create(
        [
          {
            ...task,
            user: req.user._id,
          },
        ],
        { session },
      );

      savedTasks.push(newTask[0]);
      
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "AI plan approved successfully",
      count: savedTasks.length,
      tasks: savedTasks,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
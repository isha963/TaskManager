import asyncHandler from "express-async-handler";
import { generateWithGemini } from "../services/geminiService.js";

export const generateTaskPlan = asyncHandler(async (req, res) => {
  const { goal, duration, hoursPerDay, experienceLevel } = req.body;
const allowedLevels = ["Beginner", "Intermediate", "Advanced"];
  // Validate input

  
    if (!allowedLevels.includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message:"please enter correct experience level", 
     })
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

  try {
    result = await generateWithGemini(prompt);
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
  });
});

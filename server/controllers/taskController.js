import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

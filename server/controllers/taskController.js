import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.create({

      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id

    });

  

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

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({user:req.user._id});

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
     
const task = await Task.findOneAndUpdate( {
      _id: req.params.id,
      user: req.user._id,
    },req.body,{
  new: true,
  runValidators: true,
});
    
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteTask
  = async (req, res) => {
    try {
     
      
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message:"Task not found",
        })
      }
      res.status(200).json({
        success: true,
        message: "task deleted successfully",
        task,
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
   }
 }
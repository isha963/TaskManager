import Task from "../models/Task.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";


export const createTask =asyncHandler( async (req, res) => {
  
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
  
  
});

export const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({user:req.user._id});

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  
});

export const getTaskById =asyncHandler( async (req, res) => {

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      task,
    });
 
  
});

export const updateTask = asyncHandler(async (req, res) => {

     
const task = await Task.findOneAndUpdate( {
      _id: req.params.id,
      user: req.user._id,
    },req.body,{
  new: true,
  runValidators: true,
});
    
    
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
 
})

export const deleteTask
  = asyncHandler (async (req, res) => {
  
     
      
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        throw new ApiError(404, "Task not found");
      }
      res.status(200).json({
        success: true,
        message: "task deleted successfully",
        task,
      })

   
 })
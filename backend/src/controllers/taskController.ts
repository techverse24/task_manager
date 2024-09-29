import { Request, Response, NextFunction } from "express";

import { Task } from "../models/Task";
import { ErrorHandler } from "../middlewares/errorMiddleware";

// Create a new task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { title, description, status, priority, dueDate, assignedTo, tags } =
    req.body;

  // Validate required fields
  if (!title || !description || !dueDate || !assignedTo) {
    return next(
      new ErrorHandler(
        "Title, description, due date, and assignedTo are required",
        400
      )
    );
  }

  try {
    const task = new Task({
      title,
      description,
      status: status || "To Do", // Default status if not provided
      priority: priority || "Medium", // Default priority if not provided
      dueDate,
      assignedTo,
      tags: tags || [], // Default to empty array if not provided
      createdBy: req.user?.userId, // Assume you have a createdBy field to store who created the task
    });

    await task.save();
    res.status(201).json(task);
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

// Get all tasks for the logged-in user
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tasks = await Task.find({ createdBy: req.user?.userId });
    res.status(200).json(tasks);
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

// Update a task by its ID
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { taskId } = req.params;
  const { title, description, status, priority, dueDate, assignedTo, tags } =
    req.body;

  // Validate taskId
  if (!taskId) {
    return next(new ErrorHandler("Task ID is required", 400));
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user?.userId },
      { title, description, status, priority, dueDate, assignedTo, tags },
      { new: true, runValidators: true } // Ensures validation occurs on update
    );

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    res.status(200).json(task);
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

// Delete a task by its ID
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { taskId } = req.params;

  // Validate taskId
  if (!taskId) {
    return next(new ErrorHandler("Task ID is required", 400));
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: taskId,
      createdBy: req.user?.userId,
    });

    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

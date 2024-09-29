import { NextFunction, Request, Response } from "express";

import { List } from "../models/List";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { ErrorHandler } from "../middlewares/errorMiddleware";

// create a new list
export const createList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }

    const list = new List({ name, project: projectId });
    await list.save();

    project.lists.push(list._id);
    await project.save();

    res.status(201).json(list);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Get all lists for a project
export const getListsByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const lists = await List.find({ project: projectId }).populate("tasks");
    res.status(200).json(lists);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Add a task to a list
export const addTaskToList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { listId } = req.params;
    const { taskId } = req.body;

    const list = await List.findById(listId);
    if (!list) {
      return next(new ErrorHandler("List not found", 404));
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new ErrorHandler("Task not found", 404));
    }

    list.tasks.push(task._id);
    await list.save();

    res.status(200).json(list);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Delete a list
export const deleteList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { listId } = req.params;

    const list = await List.findByIdAndDelete(listId);
    if (!list) {
      return next(new ErrorHandler("List not found", 404));
    }

    await Project.findByIdAndUpdate(list.project, { $pull: { lists: listId } });

    res.status(200).json({ message: "List deleted successfully" });
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

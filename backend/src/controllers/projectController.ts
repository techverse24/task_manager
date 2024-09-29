import { Request, Response, NextFunction } from "express";

import { List } from "../models/List";
import { Project } from "../models/Project";
import { ErrorHandler } from "./../middlewares/errorMiddleware";

// Create a new project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, createdBy } = req.body;

    const project = new Project({
      name,
      description,
      createdBy,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await Project.find().populate("lists");
    res.status(200).json(projects);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Get a single project by ID
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("lists");
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json(project);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Update a project
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true }
    );

    if (!updatedProject) {
      return next(new ErrorHandler("Project not found", 404));
    }

    res.status(200).json(updatedProject);
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Delete a project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return next(new ErrorHandler("Project not found", 404));
    }

    await List.deleteMany({ project: projectId });

    res
      .status(200)
      .json({ message: "Project and associated lists deleted successfully" });
  } catch (err: any) {
    next(new ErrorHandler(err.message, 500));
  }
};

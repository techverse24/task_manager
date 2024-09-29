import { Router } from "express";

import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController"; // Import list controller functions
import { authMiddleware } from './../middlewares/authMiddleware';

const router = Router();

// Create a new List
router.post("/", authMiddleware, createProject);

// Get all Lists for a Project
router.get("/", authMiddleware, getAllProjects);

// Get a single List by its ID
router.get("/:projectId", authMiddleware, getProjectById);

// Update a List by its ID
router.put("/:projectId", authMiddleware, updateProject);

// Delete a List by its ID
router.delete("/:projectId", authMiddleware, deleteProject);

export default router;

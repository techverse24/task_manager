import { Router } from "express";

import {
  createList,
  addTaskToList,
  deleteList,
  getListsByProject,
} from "./../controllers/listController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Create a new List
router.post("/project/:projectId/lists", authMiddleware, createList);

// Get all Lists for a Project
router.get("/project/:projectId/lists", authMiddleware, getListsByProject);

// Get a single List by its ID
router.get(
  "/project/:projectId/lists/:listId/task",
  authMiddleware,
  addTaskToList
);

// Delete a List by its ID
router.delete("/project/:projectId/lists/:listId", authMiddleware, deleteList);

export default router;
import { body } from "express-validator";

export const taskValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("column").notEmpty().withMessage("Task must belong to a column"),
];

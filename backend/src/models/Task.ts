import mongoose, { Document } from "mongoose";

interface ITask extends Document {
  _id: mongoose.Schema.Types.ObjectId
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: Date;
  assignedTo: string;
  tags: string[];
  createdBy: string;
}

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true, 
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);

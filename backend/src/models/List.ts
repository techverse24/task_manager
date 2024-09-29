import mongoose, { Document } from "mongoose";

interface IList extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  tasks: mongoose.Schema.Types.ObjectId[];
  project: mongoose.Schema.Types.ObjectId; 
}

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, 
  },
  {
    timestamps: true,
  }
);

export const List = mongoose.model<IList>("List", ListSchema);

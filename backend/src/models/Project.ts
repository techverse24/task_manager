import mongoose, { Document} from "mongoose";

interface IProject extends Document {
  name: string;
  description: string;
  lists: mongoose.Schema.Types.ObjectId[]; 
  createdBy: string; 
}

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }], 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
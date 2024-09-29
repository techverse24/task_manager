export interface User {
  name: string;
  email: string;
  password: string;
  googleId?: string;
}

export interface Project {
  name: string;
  description: string;
  lists: List[];
  createdBy: string;
}

export interface List {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  project: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: Date;
  assignedTo: string;
  tags: string[];
  createdBy: string;
}

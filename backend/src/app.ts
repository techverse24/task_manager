import cors from "cors";
import express, { Request, Response } from "express";
import passport from "passport";
import session from 'express-session';

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import listRoutes from "./routes/listRoutes";
import projectRoutes from "./routes/projectRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }, 
}));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lists", listRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/project", projectRoutes);

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Authorised"
  })
})
app.get("/", (req, res) => {
  res.send(`<h1>Home</h1><a href="/api/v1/auth/google">Login with Google</a>`);
});

// Error-handling middleware must come after routes
app.use(errorMiddleware);

export default app;

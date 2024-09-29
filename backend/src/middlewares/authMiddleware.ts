import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "./errorMiddleware";

// Middleware to authenticate user
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"

  if (!token) {
    // Return an error if the token is missing
    return next(new ErrorHandler("Authentication token is missing", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      userId: string;
    };
    req.user = { userId: decoded.userId }; // Assuming you store userId in the token payload
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    // Handle invalid token
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

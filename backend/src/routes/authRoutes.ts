import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

import { googleStrategy } from "../controllers/authController";
import { loginUser, registerUser } from "../controllers/authController";
import { ErrorHandler } from "../middlewares/errorMiddleware";

const router = Router();

// Google Strategy
passport.use(googleStrategy);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/hello"); 
});

// Logout route
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 500));
    }
    res.redirect("/"); 
  });
});

// default login routes

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;

import { google } from "googleapis";
import crypto from "crypto"; 
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { config } from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { IUser, User } from "../models/User";
import { ErrorHandler } from "../middlewares/errorMiddleware";

config(); 

// Google OAuth Client Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URL! 
);

const scopes = [
  "https://www.googleapis.com/auth/drive.metadata.readonly"
];

export const generateGoogleAuthUrl = (req: Request, res: Response, next: NextFunction): void => {
  try {

    const state = crypto.randomBytes(32).toString("hex");

    if (req.session) {
      req.session.state = state; 
    } else {
      return next(new ErrorHandler("Session not initialized", 500));
    }

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", 
      scope: scopes, 
      include_granted_scopes: true, 
      state, 
    });

    res.redirect(authorizationUrl);
  } catch (error) {
    next(new ErrorHandler("Failed to generate Google OAuth URL", 500));
  }
};

// Google OAuth Callback handler
export const handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { state, code } = req.query;

  if (!req.session || state !== req.session.state) {
    return next(new ErrorHandler("Invalid state parameter", 403));
  }

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    res.redirect("/"); 
  } catch (error) {
    next(new ErrorHandler("Google OAuth failed", 500));
  }
};

// User Registration
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 409));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(new ErrorHandler("Server Error. Please try again later.", 500));
  }
};

// User Login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(new ErrorHandler("Server error. Please try again later.", 500));
  }
};

// Google OAuth Strategy for Passport
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_REDIRECT_URL!, 
  },
  async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value, 
        });
        await user.save();
      }

      done(null, user); 
    } catch (error) {
      done(error, null); 
    }
  }
);

passport.serializeUser((user:any, done: (err: any, _id?: any) => void) => {
  done(null, user._id.toString()); 
});

passport.deserializeUser(async (id: string, done: (err: any, user?: IUser | null) => void) => {
  try {
    const user = await User.findById(id); 
    done(null, user);
  } catch (err) {
    done(err, null); 
  }
});


import { RequestHandler } from "express";
import AppError from "../utils/AppError";
import { UserDocument } from "../types/userTypes";

// here i edited the gloabl request interface to tell ts that the req may hold the user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument & { role: string };
    }
  }
}

const restrictTo = (...allowedRoles: string[]): RequestHandler => {
  return (req, _, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to perform this action!", 401));
    }
    next();
  };
};

export default restrictTo;

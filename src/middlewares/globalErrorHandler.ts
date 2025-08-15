import { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendRes";
import AppError from "../utils/AppError";
import { ZodError } from "zod";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // my custom error that i throw
  if (err instanceof AppError) {
    return sendResponse.badRequest(res, err.message);
  }

  if (err instanceof ZodError) {
    return sendResponse.badRequest(res, "Validation Error");
  }

  // unexpected errors
  return sendResponse.internalError(res, "something went wrong!");
};

export default globalErrorHandler;

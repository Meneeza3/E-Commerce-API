import { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendResponse";
import AppError from "../utils/AppError";
import { ZodError } from "zod";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  // trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error
  else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle different types of errors
  if (err instanceof ZodError) {
    const message =
      process.env.NODE_ENV === "development"
        ? `Validation Error: ${err.issues
            .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ")}`
        : "Invalid input data";

    err = new AppError(message, 400);
  }

  // MongoDB cast error
  if (err.name === "CastError") {
    const message =
      process.env.NODE_ENV === "development"
        ? `Invalid ${err.path}: ${err.value}`
        : "Invalid data format";

    err = new AppError(message, 400);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;

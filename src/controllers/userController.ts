import { RequestHandler } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import sendResponse from "../utils/sendResponse";

const getOneUser: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User does not exist", 400));
  sendResponse.success(res, "User exist", user);
});

export { getOneUser };

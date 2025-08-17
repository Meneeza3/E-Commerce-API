import { RequestHandler } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import env from "../config/env";
import User from "../models/userModel";
import { UserDocument } from "../types/userTypes";

const protect: RequestHandler = catchAsync(async (req, res, next) => {
  let token: string | undefined;

  // check if the user logged in
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new AppError("Please Login first", 401));

  // verify the token
  const decodedData = jwt.verify(token, env.JWT_SECRET) as { id: string };

  // check if this id belongs to existed user
  const checkUser = await User.findById(decodedData.id);
  if (!checkUser)
    return next(new AppError("The user belonging to this token no longer exist", 404));

  // check if the user change his password after the token created

  req.user = checkUser;
  next();
});

export default protect;

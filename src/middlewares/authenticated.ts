import { RequestHandler } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import env from "../config/env";
import User from "../models/userModel";

const protect: RequestHandler = catchAsync(async (req, res, next) => {
  let token: string | undefined;

  // 1- check if the user logged in
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new AppError("Please Login first", 401));

  // 2- check if the token is valid
  let decodedData: any;
  try {
    decodedData = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };
  } catch (_) {
    return next(new AppError("Invalid Token", 400));
  }

  // check for the user belonging to this token
  const checkUser = await User.findById(decodedData.id).select("+refreshToken");
  if (!checkUser)
    return next(new AppError("The user belonging to this token no longer exist", 404));

  // check for the refresh token (user can be logged out)
  if (!checkUser.refreshToken) return next(new AppError("Please login again first", 401));

  // check if the user change his password after the token created

  req.user = checkUser;
  next();
});

export default protect;

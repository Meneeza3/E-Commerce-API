import { RequestHandler } from "express";
import { signupSchema, loginSchema } from "../validation/authValidation";
import authService from "../services/authService";
import sendResponse from "../utils/sendRes";
import catchAsync from "../utils/catchAsync";
import env from "../config/env";

const signup: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = signupSchema.parse(req.body);
  const { firstName, lastName, email, password } = validatedData;
  let { role } = validatedData;

  if (role != "admin") role = "user";
  const {
    userObj: newUser,
    accessToken,
    refreshToken,
  } = await authService.signup({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  // refresh token in http cookie only
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 34 * 60 * 60 * 1000, // 30d
  });

  // send only access token in the res
  sendResponse.success(res, "The user created successfully", newUser, accessToken);
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  const { userObj: user, accessToken, refreshToken } = await authService.login({ email, password });

  // refresh token in http cookie only
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 34 * 60 * 60 * 1000, // 30d
  });

  sendResponse.success(res, "User Logged in successfully", user, accessToken);
});

const logout: RequestHandler = async (req, res) => {
  await authService.logout(req.user!.id);
  sendResponse.success(res, "User Logged out successfully");
};
export { signup, login, logout };

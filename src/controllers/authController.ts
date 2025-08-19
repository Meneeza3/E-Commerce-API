import { RequestHandler, Response } from "express";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  resetPasswordWithTokenSchema,
} from "../validation/authValidation";
import authService from "../services/authService";
import sendResponse from "../utils/sendResponse";
import catchAsync from "../utils/catchAsync";
import env from "../config/env";
import AppError from "../utils/AppError";

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

const signup: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = signupSchema.parse(req.body);
  const { firstName, lastName, email, password } = validatedData;
  let { role } = validatedData;

  if (role != "admin") role = "user";
  const { userObj, accessToken, refreshToken } = await authService.signup({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  // refresh token in http cookie only
  setRefreshTokenCookie(res, refreshToken);

  // send only access token in the res
  sendResponse.success(res, "The user created successfully", userObj, accessToken);
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  const { userObj: user, accessToken, refreshToken } = await authService.login({ email, password });

  // refresh token in http cookie only
  setRefreshTokenCookie(res, refreshToken);

  sendResponse.success(res, "User Logged in successfully", user, accessToken);
});

const logout: RequestHandler = catchAsync(async (req, res) => {
  await authService.logout(req.user!.id);
  clearRefreshTokenCookie(res);
  sendResponse.success(res, "User Logged out successfully");
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) throw new AppError("Refresh Token not found", 401);

  const { accessToken, refreshToken } = await authService.refreshToken(oldRefreshToken);

  clearRefreshTokenCookie(res); // to avoid any browser cookie conflicts
  setRefreshTokenCookie(res, refreshToken);

  sendResponse.success(res, "Tokens now updated", null, accessToken);
});

// user logged in or not
const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = resetPasswordSchema.parse(req.body);

  const { email } = validatedData;
  const message = await authService.resetPassword(email);

  sendResponse.success(res, message);
});

const resetPasswordWithToken: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = resetPasswordWithTokenSchema.parse(req.body);
  const { newPassword } = validatedData;
  const { token } = req.params;

  const { user, message } = await authService.resetPasswordWithToken(newPassword, token);

  // logout the user after changing the password
  authService.logout(user.id);
  sendResponse.success(res, message);
});

export { signup, login, logout, refreshToken, resetPassword, resetPasswordWithToken };

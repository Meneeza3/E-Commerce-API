import { RequestHandler } from "express";
import { signupSchema, loginSchema } from "../validation/authValidation";
import authService from "../services/authService";
import sendResponse from "../utils/sendRes";
import catchAsync from "../utils/catchAsync";

const signup: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = signupSchema.parse(req.body);
  const { firstName, lastName, email, password } = validatedData;
  let { role } = validatedData;

  if (role != "admin") role = "user";
  const { userObj: newUser, token } = await authService.signup({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  sendResponse.success(res, "The user created successfully", newUser, token);
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  const { userObj: user, token } = await authService.login({ email, password });
  sendResponse.success(res, "User Logged in successfully", user, token);
});
export { signup, login };

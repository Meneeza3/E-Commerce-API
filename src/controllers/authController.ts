import z, { ZodError } from "zod";
import { RequestHandler } from "express";
import { signupSchema } from "../validation/authValidation";
import authService from "../services/authService";
import sendResponse from "../utils/sendRes";
import { send } from "process";
const signup: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { firstName, lastName, email, password } = validatedData;

    const newUser = await authService.signup({ firstName, lastName, email, password });
    sendResponse.success(res, "The user created successfully", newUser);
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern?.email) {
      sendResponse.badRequest(res, "Email address is already registered");
    } else {
      sendResponse.badRequest(res, "validation Error", err);
    }
  }
};
const login = () => {};
export { signup, login };

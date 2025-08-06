import { RequestHandler } from "express";
import User from "../models/userModel";
import { signupSchema } from "../validation/authValidation";
import z from "zod";

const signup: RequestHandler = async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { firstName, lastName, email, password } = validatedData;

    const newUser = await User.create({ firstName, lastName, email, password });
    res.status(201).json({
      status: "success",
      message: "user created",
      data: newUser,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        status: "fail",
        message: "Validation Error",
        errors: err.message,
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: "Validation error",
        err: "something went wrong",
      });
    }
  }
};
const login = () => {};
export { signup, login };

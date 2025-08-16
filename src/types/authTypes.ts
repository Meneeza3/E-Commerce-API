import z from "zod";
import { signupSchema } from "../validation/authValidation";

type signupSchemaType = z.infer<typeof signupSchema>;

// execlude the passwordConfirm field
export type signupData = Omit<signupSchemaType, "passwordConfirm">;

export type loginData = {
  email: string;
  password: string;
};

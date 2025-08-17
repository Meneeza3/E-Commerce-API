import { email, z } from "zod";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First Name must be at least 2 characters")
      .max(12, "First Name cannot exceed 12 characters"),

    lastName: z
      .string()
      .min(2, "Last Name must be at least 2 characters")
      .max(12, "Last Name cannot exceed 12 characters"),

    email: z.string().email("Please provide a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),

    passwordConfirm: z.string(),
    role: z.string().optional().default("user"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // this shows error on passwordConfirm field
  });

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(8, "your Password is at least 8 characters")
    .max(128, "Password is at most 128 characters"),
});

export { signupSchema, loginSchema }; // check the data at runtime

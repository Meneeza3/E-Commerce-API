import { z } from "zod";
import { config } from "dotenv";

// keeps the terminal clean
config({ quiet: true });

export default z
  .object({
    NODE_ENV: z.enum(["production", "development"]).default("development"),
    PORT: z.coerce.number().positive().default(3000),
    DATABASE: z
      .string()
      .regex(/^mongodb(\+srv)?:\/\//, "DATABASE must be a valid MongoDB connection string"),
    DATABASE_PASS: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    GMAIL_USER: z.string(),
    GMAIL_APP_PASSWORD: z.string(),
    PASSWORD_RESET_TOKEN_EXPIRES: z.string(),
    PASSWORD_RESET_SECRET: z.string(),
    MAILTRAP_HOST: z.string(),
    MAILTRAP_PORT: z.coerce.number(),
    MAILTRAP_USER: z.string(),
    MAILTRAP_PASS: z.string(),
    FRONTEND_URL: z.string(),
  })
  .parse(process.env);

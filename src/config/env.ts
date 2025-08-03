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
  })
  .parse(process.env);

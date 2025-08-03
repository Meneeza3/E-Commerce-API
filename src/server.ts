import env from "./config/env";
import mongoose from "mongoose";

const DB = env.DATABASE.replace("<PASSWORD>", env.DATABASE_PASS);
mongoose
  .connect(DB)
  .then(() => console.log("Connected To DB successfully"))
  .catch((err) => console.log("ERROR 💥", err.message));

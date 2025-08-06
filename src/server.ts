import env from "./config/env";
import mongoose from "mongoose";
import app from "./app";

const DB = env.DATABASE.replace("<PASSWORD>", env.DATABASE_PASS);
mongoose
  .connect(DB)
  .then(() => console.log("Connected To DB successfully"))
  .catch((err) => console.log("ERROR 💥", err.message));

app.listen(env.PORT, () => console.log(`Start Listen at port ${env.PORT}`));

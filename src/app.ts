import express from "express";
import { userRouter } from "./routes/userRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { categoryRouter } from "./routes/categoryRoutes";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use(globalErrorHandler);

export default app;

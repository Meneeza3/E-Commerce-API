import express from "express";
import { userRouter } from "./routes/userRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use(globalErrorHandler);

export default app;

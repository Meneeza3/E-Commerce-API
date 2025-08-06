import express from "express";
import { signup, login } from "../controllers/authController";
const router = express.Router();

router.route("/signup").get(signup);

export { router as userRouter };

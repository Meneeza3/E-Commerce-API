import express from "express";
import { signup, login } from "../controllers/authController";
import { getOneUser } from "../controllers/userController";
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/:id").get(getOneUser);

export { router as userRouter };

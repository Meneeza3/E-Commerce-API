import express from "express";
import { signup, login } from "../controllers/authController";
import { getOneUser } from "../controllers/userController";
const router = express.Router();

router.route("/signup").get(signup);
router.route("/login").get(login);

router.route("/:id").get(getOneUser);

export { router as userRouter };

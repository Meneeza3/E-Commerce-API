import express from "express";
import { signup, login, logout } from "../controllers/authController";
import { getOneUser } from "../controllers/userController";
import restrictTo from "../middlewares/authorized";
import protect from "../middlewares/authenticated";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

// PROTECTED ROUTES
router.use(protect);
router.route("/logout").post(logout);

// to test
router.use(restrictTo("admin"));
router.route("/:id").get(getOneUser);

export { router as userRouter };

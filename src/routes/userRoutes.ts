import express from "express";
import { signup, login } from "../controllers/authController";
import { getOneUser } from "../controllers/userController";
import restrictTo from "../middlewares/authorized";
import protect from "../middlewares/authenticated";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

// to test
router.use(protect);
router.use(restrictTo("admin"));
router.route("/:id").get(getOneUser);

export { router as userRouter };

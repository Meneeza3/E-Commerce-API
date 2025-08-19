import express from "express";
import {
  signup,
  login,
  logout,
  refreshToken,
  resetPassword,
  resetPasswordWithToken,
} from "../controllers/authController";
import { getOneUser } from "../controllers/userController";
import restrictTo from "../middlewares/authorized";
import protect from "../middlewares/authenticated";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgot-password").post(resetPassword);
router.route("/reset-password/:token").post(resetPasswordWithToken);

// PROTECTED ROUTES
router.use(protect);
router.route("/logout").post(logout);
router.route("/refresh-token").post(refreshToken);
router.route("/change-password").post(resetPassword);

// to test
router.use(restrictTo("admin"));
router.route("/:id").get(getOneUser);

export { router as userRouter };

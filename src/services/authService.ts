import jwt from "jsonwebtoken";
import { signupData, loginData } from "../types/authTypes";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import bcrypt from "bcrypt";
import env from "../config/env";
import crypto, { hash } from "crypto";
import EmailService from "../utils/emailService";
import emailService from "../utils/emailService";

// Remember: don't return the res in service BUT throw errors to catch it in the controller
class authService {
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  //jwt.verify(token, secretOrPublicKey, [options, callback])

  private signToken = (id: string) => {
    const accessToken = jwt.sign({ id }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as object);

    const refreshToken = jwt.sign({ id }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as object);

    return { accessToken, refreshToken };
  };

  async signup(data: signupData) {
    const checkUser = await User.findOne({ email: data.email });
    if (checkUser) throw new AppError("User Already Existed", 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const { accessToken, refreshToken } = this.signToken(user.id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await User.findByIdAndUpdate(user.id, { refreshToken: hashedRefreshToken });

    // send the data i want
    const userObj = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    return { userObj, accessToken, refreshToken };
  }

  async login(data: loginData) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AppError("Email or Password not correct", 401);

    const { accessToken, refreshToken } = this.signToken(user.id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await User.findByIdAndUpdate(user.id, { refreshToken: hashedRefreshToken });

    const userObj = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    return { userObj, accessToken, refreshToken };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshToken(refreshToken: string) {
    let decoded: any;

    // in protect: check access token, in refreshToken: check refrseh token
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
    } catch (_) {
      throw new AppError("Invalid refresh token", 400);
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken)))
      throw new AppError("Invalid refresh token", 400);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this.signToken(user.id);

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await User.findByIdAndUpdate(user.id, { refreshToken: hashedNewRefreshToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async resetPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("No user belongs to this email", 400);

    const resetToken = crypto.randomBytes(32).toString("hex"); // to user
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // in DB
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user.id, {
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: tokenExpiry,
    });

    emailService.sendResetEmail(user.email, user.firstName, resetToken);

    const message =
      "please check your email. If you don't receive an email within 5 minutes, please try again";
    return message;
  }

  async resetPasswordWithToken(password: string, token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) throw new AppError("Invalid or expired token", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    });

    return {
      user,
      message: "Your password updated successfully, Please login again with your new password",
    };
  }
}

export default new authService();

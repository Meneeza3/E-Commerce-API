import jwt from "jsonwebtoken";
import { signupData, loginData } from "../types/authTypes";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import bcrypt from "bcrypt";
import env from "../config/env";

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

    // to not send the password in the res
    const { password, refreshToken: _, ...userObj } = user.toObject();
    return { userObj, accessToken, refreshToken };
  }

  async login(data: loginData) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AppError("Email or Password not correct", 401);

    const { accessToken, refreshToken } = this.signToken(user.id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await User.findByIdAndUpdate(user.id, { refreshToken: hashedRefreshToken });

    const { password, refreshToken: _, ...userObj } = user.toObject();
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
}

export default new authService();

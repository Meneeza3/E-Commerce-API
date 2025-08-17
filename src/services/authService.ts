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

    await User.findByIdAndUpdate(user.id, { refreshToken });

    // to not send the password in the res
    const { password, refreshToken: _, ...userObj } = user.toObject();
    return { userObj, accessToken, refreshToken };
  }

  async login(data: loginData) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AppError("Email or Password not correct", 401);

    const { accessToken, refreshToken } = this.signToken(user.id);

    const { password, refreshToken: _, ...userObj } = user.toObject();
    return { userObj, accessToken, refreshToken };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }
}

export default new authService();

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
    return jwt.sign({ id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as object);
  };

  async signup(data: signupData) {
    const checkUser = await User.findOne({ email: data.email });
    if (checkUser) throw new AppError("User Already Existed", 400);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    // to not send the password in the res
    const { password, ...userObj } = user.toObject();
    const token = this.signToken(user.id);
    return { userObj, token };
  }

  async login(data: loginData) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AppError("Email or Password not correct", 401);

    const token = this.signToken(user.id);

    const { password, ...userObj } = user.toObject();
    return { userObj, token };
  }
}

export default new authService();

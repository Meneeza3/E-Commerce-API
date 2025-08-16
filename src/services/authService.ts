import { signupData, loginData } from "../types/authTypes";
import User from "../models/userModel";
import AppError from "../utils/AppError";
import bcrypt from "bcrypt";
import env from "../config/env";

// Remember: don't return the res in service BUT throw errors to catch it in the controller
class authService {
  //private createSendToken = ();

  async signup(data: signupData) {
    const checkUser = await User.findOne({ email: data.email });
    if (checkUser) throw new AppError("User Already Existed", 400);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });

    // to not send the password in the res
    const { password, ...userObj } = user.toObject();
    return userObj;
  }

  async login(data: loginData) {
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user || !(await bcrypt.compare(data.password, user.password)))
      throw new AppError("Email or Password not correct", 401);

    const { password, ...userObj } = user.toObject();
    return userObj;
  }
}

export default new authService();

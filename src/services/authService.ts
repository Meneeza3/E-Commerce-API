import { signupData } from "../types/authTypes";
import User from "../models/userModel";
import AppError from "../utils/AppError";

// Remember: u don't return the res in service BUT throw errors to catch it in the controller
class authService {
  async signup(data: signupData) {
    const checkUser = await User.findOne({ email: data.email });
    if (checkUser) throw new AppError("User Already Existed", 400);
    return await User.create(data);
  }
}

export default new authService();

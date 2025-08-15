import { signupData } from "../types/authTypes";
import User from "../models/userModel";
class authService {
  async signup(data: signupData) {
    return await User.create(data);
  }
}

export default new authService();

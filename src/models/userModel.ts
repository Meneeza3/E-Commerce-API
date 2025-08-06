import { Schema, model } from "mongoose";
import { UserDocument, UserModel } from "../types/userTypes";

const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: [true, "A user must have a First Name"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a Last Name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an Email"],
  },
  password: {
    type: String,
    required: [true, "A user must have an Password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "u have to enter a Password Confirm"],
  },
  role: {
    type: String,
    default: "user",
  },
});

// lose TS benefits
// const User = mongoose.model("User", userSchema);

const User = model<UserDocument, UserModel>("User", userSchema);

export default User;

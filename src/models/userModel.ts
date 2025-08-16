import { Schema, model } from "mongoose";
import { UserDocument, UserModel } from "../types/userTypes";

const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: [true, "A user must have a First Name"],
    minlength: [2, "First Name must be at least 2 characters"],
    maxlength: [12, "First Name cannot exceed 12 characters"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a Last Name"],
    minlength: [2, "Last Name must be at least 2 characters"],
    maxlength: [12, "Last Name cannot exceed 12 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an Email"],
  },
  password: {
    type: String,
    required: [true, "A user must have an Password"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [128, "Password cannot exceed 128 characters"],
    select: false,
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

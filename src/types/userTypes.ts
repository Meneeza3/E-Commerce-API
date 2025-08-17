import { Document, Model } from "mongoose";

// structure of the user schema & instance methods
export type UserDocument = Document & {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: "admin" | "user";
  refreshToken: string;
};

// structure of the static methods (on the model itself)
export type UserModel = Model<UserDocument> & {};

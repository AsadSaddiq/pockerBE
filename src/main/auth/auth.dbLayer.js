import { UserModel } from "../user/user.schema.js";
import ResetToken from "./models/ResetToken.js";

export const AuthDbLayer = {
  getAll: async () => {
    return UserModel.find();
  },
  getById: async (id) => {
    return UserModel.findById(id);
  },

  register: async (body) => {
    return UserModel.create({ ...body });
  },

  delete: async (id) => {
    return UserModel.findByIdAndDelete(id);
  },

  login: async (body) => {
    try {
      return UserModel.findOne({ email: body.email });
    } catch (error) {
      return "no user exist";
    }
  },
  updateLastLogin: async (id) => {
    return UserModel.findByIdAndUpdate(
      id,
      { lastLogin: new Date() },
      { new: true }
    );
  },
  deleteTokens: async (id) => {
    return await ResetToken.deleteMany({ userId: id });
  },
  createResetToken: async ({ userId, token }) => {
    const resetTokenDoc = await ResetToken.create({ userId, token });
    if (!resetTokenDoc) {
      throw new Error("Failed to create reset token");
    }
    return resetTokenDoc;
  },

  checkToken: async (token) => {
    console.log("token");
    console.log(token);
    const response = await ResetToken.findOne({ token: token });
    if (!response) {
      throw new Error("given token is not valid");
    }
    return response;
  },
  updatePassword: async (userId, hashedPassword) => {
    const response = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!response) {
      throw new Error("Failed to create reset token");
    }
    return response;
  },
};

import User from "../user/User.model.js";
import ResetToken from "./models/resetpassword.js";

export const AuthDbLayer = {
  getAll: async () => {
    return await User.findAll();
  },

  getById: async (id) => {
    return await User.findByPk(id);
  },

  register: async (body) => {
    const user = await User.create({ ...body });
    const plainUser = user.get({ plain: true });
    delete plainUser.password;
    return plainUser;
  },

  delete: async (id) => {
    return await User.destroy({ where: { id } });
  },

  login: async (body) => {
    try {
      return await User.findOne({ where: { email: body.email } });
    } catch (error) {
      return "no user exist";
    }
  },

  updateLastLogin: async (id) => {
    return await User.update(
      { lastLogin: new Date() },
      { where: { id }, returning: true }
    ).then(([rows, [user]]) => user);
  },

  deleteTokens: async (id) => {
    return await ResetToken.destroy({ where: { userId: id } });
  },

  createResetToken: async ({ userId, token }) => {
    const resetTokenDoc = await ResetToken.create({ userId, token });
    if (!resetTokenDoc) {
      throw new Error("Failed to create reset token");
    }
    return resetTokenDoc;
  },

  checkToken: async (token) => {
    const response = await ResetToken.findOne({ where: { token } });
    if (!response) {
      throw new Error("Given token is not valid");
    }
    return response;
  },

  updatePassword: async (userId, hashedPassword) => {
    const [rows, [updatedUser]] = await User.update(
      { password: hashedPassword },
      { where: { id: userId }, returning: true }
    );
    if (!updatedUser) {
      throw new Error("Failed to update password");
    }
    return updatedUser;
  },
};

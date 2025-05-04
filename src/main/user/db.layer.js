import User from "./User.model.js";
import { Op } from "sequelize";

export const UserDbLayer = {
  getAllUsers: async () => {
    return await User.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
  },

  getProfile: async (id) => {
    return await User.findByPk(id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
  },

  delete: async (id) => {
    return await User.destroy({
      where: { id },
    });
  },

  updateRole: async (id, role) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    user.roles = role;
    await user.save();
    return user;
  },

  update: async (id, userData) => {
    await User.update(userData, { where: { id } });
    return await User.findByPk(id);
  },

  login: async (body) => {
    return await User.findOne({
      where: { email: body.email },
    });
  },

  getById: async (id) => {
    return await User.findByPk(id);
  },

  getByEmail: async (email) => {
    return await User.findOne({
      where: { email },
    });
  },
};

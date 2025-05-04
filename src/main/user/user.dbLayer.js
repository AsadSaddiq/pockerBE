import { UserModel } from "./user.schema.js";

export const UserDbLayer = {
  getAllUsers: async () => {
    return UserModel.find().select("-password -__v");
  },
  getProfile: async (id) => {
    return UserModel.findById(id).select("-password -__v");
  },

  delete: async (id) => {
    return UserModel.findByIdAndDelete(id);
  },

  updateRole: async (id, role) => {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: { "roles.0": role } },
      { new: true }
    );
  },
  update: async (id, user) => {
    return UserModel.findByIdAndUpdate(id, { $set: user }, { new: true });
  },
  login: async (body) => {
    try {
      return UserModel.findOne({ email: body.email });
    } catch (error) {
      return "no user exist";
    }
  },
  getById: async (id) => {
    return UserModel.findById(id);
  },
  getByEmail: async (email) => {
    return UserModel.findOne({ email: email });
  },
};

import { httpResponse } from "../../utils/httpResponse.js";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import { UserDbLayer } from "./db.layer.js";

export const UserService = {
  getProfile: async (req, res) => {
    const token = req.header("authorization");
    const accessToken = token.split(" ")[1];
    const decoded = jwt.verify(accessToken, config.env.jwtSecret);
    const response = await UserDbLayer.getProfile(decoded.user.id);
    if (!response) {
      return httpResponse.NOT_FOUND(res, "User not found");
    }
    return response;
  },
  getAllUsers: async (req, res) => {
    return await UserDbLayer.getAllUsers();
  },

  updateRole: async (id, role) => {
    try {
      const user = await UserDbLayer.updateRole(id, role);
      if (!user) {
        throw new Error("Bad Request: This email has no account");
      }
      const plainUser = user.get({ plain: true });
      delete plainUser.password;
      return plainUser;
    } catch (error) {
      throw error;
    }
  },

  update: async (req, res) => {
    const token = req.header("authorization");
    const accessToken = token.split(" ")[1];
    const decoded = jwt.verify(accessToken, config.env.jwtSecret);
    const id = decoded.user.id;
    const { userName, email, phoneNo, imageUrl } = req.body;
    const user = await UserDbLayer.getById(id);
    if (!user) {
      return httpResponse.NOT_FOUND(res, "User not found");
    }

    if (user.email !== email) {
      const existingUser = await UserDbLayer.getByEmail(email);
      if (existingUser) {
        throw new Error("Bad Request: this email already exists");
      }
    }

    const updatedUser = await UserDbLayer.update(id, {
      userName,
      email,
      phoneNo,
      imageUrl,
    });

    if (!updatedUser) {
      throw new Error("Bad Request: User not found");
    }
    const plainUser = updatedUser.get({ plain: true });
    delete plainUser.password;
    return plainUser;
  },
};

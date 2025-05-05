import { httpResponse } from "../../utils/httpResponse.js";
import { ReferralService } from "../referral/referral.service.js";
import { UserService } from "./user.service.js";

export const UserController = {
  getProfile: async (req, res) => {
    try {
      const profile = await UserService.getProfile(req, res);
      return httpResponse.SUCCESS(res, profile);
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const response = await UserService.getAllUsers(req, res);
      return httpResponse.SUCCESS(res, response);
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  delete: async (req, res) => {
    try {
      const data = await UserService.delete(req.params.id);
      return httpResponse.SUCCESS(res, data);
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

  updateRole: async (req, res) => {
    try {
      const data = await UserService.updateRole(req.params.id, req.body.roles);
      return httpResponse.SUCCESS(res, data);
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
  update: async (req, res) => {
    try {
      const data = await UserService.update(req, req);
      return httpResponse.SUCCESS(res, data);
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },
  getUserReferrals: async (req, res) => {
    try {
      const response = await ReferralService.getUserReferrals(req, res);
      return httpResponse.SUCCESS(res, response);
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },
};

import { httpResponse } from "../../utils/httpResponse.js";
import { ReferralService } from "../referral/referral.service.js";
import { sendMailHelper } from "../../helper/sendMail.js";
import { AuthService } from "./auth.service.js";

export const AuthController = {
  registerByAdmin: async (req, res) => {
    try {
      const response = await AuthService.registerByAdmin(req, res);
      return httpResponse.CREATED(res, response);
    } catch (error) {
      return httpResponse.INTERNAL_SERVER_ERROR(res, error);
    }
  },

  registerByReferral: async (req, res) => {
    try {
      const response = await AuthService.registerByReferral(req, res);
      return httpResponse.CREATED(res, response);
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },

  createReferral: async (req, res) => {
    try {
      const response = await ReferralService.createReferral(req.body);
      if (req.body.email) {
        sendMailHelper({
          to: req.body.email,
          subject: "Referral Code",
          referralCode: response.refCode,
          roles: req.body.roles,
          message: req.body.message,
        });
      }
      return httpResponse.CREATED(res, response);
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },
  referralsReset: async (req, res) => {
    try {
      const response = await ReferralService.referralsReset(req, res);
      return httpResponse.CREATED(res, "limit reset successfully");
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },

  loginUser: async (req, res) => {
    try {
      const response = await AuthService.loginUser(req, res);
      return httpResponse.SUCCESS(res, response);
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },
  forgotPassword: async (req, res) => {
    try {
      console.log("fogot password", req.body.email);
      const response = await AuthService.forgotPassword(req, res);
      sendMailHelper({
        to: req.body.email,
        subject: "reset password",
        referralCode: response,
        roles: "req.body.roles",
        message: response,
      });
      return httpResponse.SUCCESS(
        res,
        "Password reset link sent to your email Please check your email"
      );
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },
  createNewPassword: async (req, res) => {
    try {
      const response = await AuthService.createNewPassword(req, res);
      return httpResponse.SUCCESS(
        res,
        "Your password has been updated successfully"
      );
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },
  updatePassword: async (req, res) => {
    try {
      const response = await AuthService.updatePassword(req, res);
      return httpResponse.SUCCESS(
        res,
        "Your password has been updated successfully"
      );
    } catch (error) {
      if (error.message.includes("Bad Request")) {
        return httpResponse.BAD_REQUEST(res, error.message);
      } else {
        return httpResponse.INTERNAL_SERVER_ERROR(res, error);
      }
    }
  },
};

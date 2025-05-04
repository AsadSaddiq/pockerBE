import { AuthDbLayer } from "./db.layer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import config from "../../config/index.js";
import { ReferralService } from "../referral/referral.service.js";
import { sendMailHelper } from "../../helper/sendMail.js";

export const AuthService = {
  registerByAdmin: async (req, res) => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHash;
    console.log(req.body);
    const data = await AuthDbLayer.register(req.body);
    return data;
  },

  registerByReferral: async (req, res) => {
    const referralCode = req.body.referralCode;
    const validateReferral = await ReferralService.validateReferral(
      referralCode
    );
    if (!validateReferral) {
      throw new Error("Bad Request: Invalid referral code");
    }
    const user = await AuthDbLayer.login(req.body);
    if (user) {
      throw new Error("Bad Request: This email has already been registered.");
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHash;
    req.body.roles = validateReferral.roles;
    req.body.referredBy = validateReferral.referrer;
    const data = await AuthDbLayer.register(req.body);
    ReferralService.updateReferral(referralCode);
    return data;
  },

  loginUser: async (req, res) => {
    console.log(req.body);
    const user = await AuthDbLayer.login(req.body);
    if (!user) {
      throw new Error("Bad Request: check your email");
    }

    const plainUser = user.get({ plain: true });
    const check = await bcrypt.compare(req.body.password, plainUser.password);
    delete plainUser.password;

    if (check) {
      const accessToken = jwt.sign({ user: plainUser }, config.env.jwtSecret);

      user.lastLogin = new Date();
      await AuthDbLayer.updateLastLogin(user.id);
      return { accessToken: accessToken };
    } else {
      throw new Error("Bad Request: check your password");
    }
  },
  forgotPassword: async (req, res) => {
    const user = await AuthDbLayer.login(req.body);
    if (!user) {
      throw new Error("Bad Request: This email has no account");
    }

    const deleted = await AuthDbLayer.deleteTokens(user.id);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = await AuthDbLayer.createResetToken({
      userId: user.id.toString(),
      token: resetToken,
    });

    if (!token) {
      throw new Error("Bad Request: token not created try again");
    }

    const resetUrl = `${req.headers.referer}/forgot-password/${resetToken}`;
    return resetUrl;
  },
  createNewPassword: async (req, res) => {
    const token = await AuthDbLayer.checkToken(req.params.token);
    const user = await AuthDbLayer.getById(token.userId);
    if (!user) {
      throw new Error("Bad Request: User Account has been deleted");
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const updated = await AuthDbLayer.updatePassword(
      token.userId,
      passwordHash
    );
    return updated;
  },
  updatePassword: async (req, res) => {
    const authHeader = req.header("authorization");
    const bearerToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(bearerToken, config.env.jwtSecret);
    const id = decoded.user._id;

    const user = await AuthDbLayer.getById(id);
    if (!user) {
      throw new Error("Bad Request: User Account has been deleted");
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    const updated = await AuthDbLayer.updatePassword(id, passwordHash);
    return updated;
  },
};

import { UserModel } from "../user/user.schema.js";
// import { ReferralDbLayer } from "./referral.dbLayer.js";
import { INVITE_LIMITS } from "../../constants/permission.js";
import ReferralLog from "./ReferralLog.model.js";
import { ReferralDbLayer } from "./db.layer.js";
import jwt from "jsonwebtoken";
import config from "../../config/index.js"

export class ReferralService {
  static async createReferral(req) {
    const referrerRole = req.body.userRole;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }
    const decoded = jwt.verify(token, config.env.jwtSecret);
    console.log("Decoded token:", decoded);
    const referrerId = decoded.user.id;
    if (referrerRole != "admin") {
      const checkLimits = await ReferralDbLayer.checkLimits(
        req.body.referrer,
        req.body.roles
      );
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const count = checkLimits.reduce((acc, item) => {
        const createdAt = new Date(item.createdAt);
        if (item.isUsed === false && createdAt < oneDayAgo) {
          return acc;
        }
        return acc + 1;
      }, 0);
      const maxAllowed = INVITE_LIMITS?.[referrerRole]?.[req.body.roles] ?? 0;
      if (maxAllowed - 1 < count) {
        throw new Error("Bad Request: You have reached the limit of invites");
      }
      console.log(maxAllowed);
    }
    return ReferralLog.create({ ...req.body, referrer_id: referrerId });
  }


  static async referralsReset(req, res) {
    const { referrerId } = req.params;
    const updated = await ReferralDbLayer.referralsReset(referrerId);
    if (!updated) {
      throw new Error("Bad Request: Invalid referral code");
    }
    return updated;
  }

  static async validateReferral(referralCode) {
    const referrer = await ReferralLog.findOne({
      where: { refCode: referralCode },
    });
    if (!referrer) {
      throw new Error("Bad Request: Invalid referral code");
    }
    if (referrer.isUsed) {
      throw new Error("Bad Request: This referral code is used");
    }
    return referrer;
  }

  static async updateReferral(referralCode) {
    try {
      const [_, [updatedReferral]] = await ReferralLog.update(
        { isUsed: true },
        {
          where: { refCode: referralCode },
          returning: true,
        }
      );
      return updatedReferral;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async trackReferral(referrerId, refereeId, role) {
    await ReferralLog.create({
      referrer: referrerId,
      referee: refereeId,
      role,
    });

    await UserModel.findByIdAndUpdate(referrerId, {
      $inc: {
        "referralCount.total": 1,
        [`referralCount.byRole.${role}`]: 1,
      },
    });
  }

  static async getUserReferrals(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Unauthorized: No token provided");
      }

      const decoded = jwt.verify(token, config.env.jwtSecret);
      console.log("Decoded token:", decoded);
      const referrerId = decoded.user.id;

      const referrals = await ReferralLog.findAll({
        where: { referrer_id: referrerId },
      });
      if (!referrals || referrals.length === 0) {
        return [];
      }
      console.log("Referrals:", referrals);
      return referrals;
    } catch (error) {
      console.error("Error in getUserReferrals:", error.message);
      throw new Error(error.message || "Failed to fetch referrals");
    }
  }

}

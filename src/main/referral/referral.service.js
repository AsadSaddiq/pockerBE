import { UserModel } from "../user/user.schema.js";
import { ReferralLogModel } from "./referralLog.schema.js";
import { httpResponse } from "../../utils/httpResponse.js";
// import { ReferralDbLayer } from "./referral.dbLayer.js";
import { INVITE_LIMITS } from "../../constants/permission.js";
import ReferralLog from "./ReferralLog.model.js";
import { ReferralDbLayer } from "./db.layer.js";

export class ReferralService {
  static async createReferral(body) {
    const referrerRole = body.userRole;

    if (referrerRole != "admin") {
      const checkLimits = await ReferralDbLayer.checkLimits(
        body.referrer,
        body.roles
      );
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const count = checkLimits.reduce((acc, item) => {
        const createdAt = new Date(item.createdAt);
        if (item.isUsed === false && createdAt < oneDayAgo) {
          return acc;
        }
        return acc + 1;
      }, 0);
      const maxAllowed = INVITE_LIMITS?.[referrerRole]?.[body.roles] ?? 0;
      if (maxAllowed - 1 < count) {
        throw new Error("Bad Request: You have reached the limit of invites");
      }
      console.log(maxAllowed);
    }
    return ReferralLog.create({ ...body });
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
}

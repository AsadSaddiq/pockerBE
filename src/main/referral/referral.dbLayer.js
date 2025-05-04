import { ReferralLogModel } from "./referralLog.schema.js";

export const ReferralDbLayer = {
  checkLimits: async (referrer, roles) => {
    console.log(roles);
    console.log(roles);

    return await ReferralLogModel.find({
      referrer: referrer,
      roles: roles,
      isReset: false,
    });
  },
  referralsReset: async (referrerId) => {
    return await ReferralLogModel.updateMany(
      { referrer: referrerId },
      { $set: { isReset: true } }
    );
  },
};

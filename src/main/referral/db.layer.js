import ReferralLog from "./ReferralLog.model.js";

export const ReferralDbLayer = {
  checkLimits: async (referrer, roles) => {
    console.log(roles);

    return await ReferralLog.findAll({
      where: {
        referrer,
        roles,
        isReset: false,
      },
    });
  },

  referralsReset: async (referrerId) => {
    return await ReferralLog.update(
      { isReset: true },
      {
        where: {
          referrer: referrerId,
        },
      }
    );
  },
};

import sequelize from "../../loader/postgress.js";
import User from "../user/User.model.js";
import ReferralLog from "../referral/ReferralLog.model.js";
import ResetToken from "../auth/models/resetpassword.js";

const models = {
  User,
  ReferralLog,
  ResetToken,
};

// Set up associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;

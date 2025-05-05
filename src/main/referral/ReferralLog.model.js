import { DataTypes } from "sequelize";
// import { ROLES } from "../../constants/roles.js";
import sequelize from "../../loader/postgress.js";

const ReferralLog = sequelize.define(
  "ReferralLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    refCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    referrer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isReset: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "referral_logs",
  }
);

ReferralLog.associate = (models) => {
  ReferralLog.belongsTo(models.User, {
    foreignKey: "referrer_id",
    as: "referrer",
  });
};

export default ReferralLog;

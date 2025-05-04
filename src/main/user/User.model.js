import { DataTypes } from "sequelize";
// import { ROLES } from "../../constants/roles.js";
import sequelize from "../../loader/postgress.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralCode: {
      type: DataTypes.STRING,
      defaultValue: "created by admin",
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "users",
  }
);

User.associate = (models) => {
  User.hasMany(models.ReferralLog, {
    foreignKey: "referrer_id",
    as: "referralLogs",
  });

  User.belongsTo(models.User, {
    as: "ReferredBy",
    foreignKey: "referred_by_id",
  });
};

export default User;

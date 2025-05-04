import { DataTypes } from "sequelize";
import sequelize from "../../../loader/postgress.js";

const ResetToken = sequelize.define(
  "ResetToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // or true if you also want updatedAt
    underscored: true,
    tableName: "reset_tokens",
  }
);

ResetToken.associate = (models) => {
  ResetToken.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
};

export default ResetToken;

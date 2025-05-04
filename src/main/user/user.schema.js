import mongoose from "mongoose";
import { ROLES } from "../../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    phoneNo: { type: String, default: null },
    imageUrl: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, default: "created by admin " },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roles: {
      type: [String],
      enum: Object.values(ROLES),
      required: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);

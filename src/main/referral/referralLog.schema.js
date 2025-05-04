import mongoose from "mongoose";
import { ROLES } from "../../constants/roles.js";

const referralLogSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refCode: { type: String, required: true },
    roles: {
      // type: [String],
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    isReset: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ReferralLogModel = mongoose.model(
  "ReferralLog",
  referralLogSchema
);

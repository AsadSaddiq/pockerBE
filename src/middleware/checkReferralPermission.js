import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { httpResponse } from "../utils/index.js";
import { REFERRAL_RULES, ROLES } from "../constants/roles.js";
import { generateReferralCode } from "../config/generateCode.js";

export const checkReferralPermission = (req, res, next) => {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return httpResponse.BAD_REQUEST(
      res,
      "Need token (JWT) to hit this API",
      "Access denied. No token provided."
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.env.jwtSecret);

    const userRole = decoded.user.roles;
    const referrer = decoded.user.id;

    if (!userRole) {
      return httpResponse.UNAUTHORIZED(
        res,
        "User role missing",
        "Invalid token."
      );
    }

    const assignableRoles = REFERRAL_RULES[userRole] || [];

    const requestedRole = req.body.roles;

    if (!requestedRole || !Object.values(ROLES).includes(requestedRole)) {
      return httpResponse.BAD_REQUEST(
        res,
        "Invalid or missing role in request",
        "Invalid role."
      );
    }

    if (!assignableRoles.includes(requestedRole)) {
      return httpResponse.FORBIDDEN(
        res,
        `Role '${userRole}' cannot assign role '${requestedRole}'`,
        "Access denied."
      );
    }

    req.body = {
      ...req.body,
      refCode: generateReferralCode(),
      referrer: referrer,
      userRole: userRole,
    };

    next();
  } catch (err) {
    return httpResponse.UNAUTHORIZED(
      res,
      "Token is not valid",
      "Invalid token."
    );
  }
};

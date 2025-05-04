import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { httpResponse } from "../utils/index.js";
import { ACCESS_RULES } from "../constants/roles.js";

export const authorize = (...requiredRoles) => {
  return (req, res, next) => {
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
      req.user = decoded;

      const userRole = decoded.user.roles;
      if (!userRole) {
        return httpResponse.UNAUTHORIZED(
          res,
          "User role missing",
          "Invalid token."
        );
      }

      // Get all roles this user role has access to
      const accessibleRoles = ACCESS_RULES[userRole] || [];

      // Check if user is allowed to access the required roles
      const hasAccess = requiredRoles.some((role) =>
        accessibleRoles.includes(role)
      );

      if (!hasAccess) {
        return httpResponse.FORBIDDEN(
          res,
          `Role '${userRole}' is not allowed to access this route.`,
          "Access denied."
        );
      }

      next();
    } catch (err) {
      return httpResponse.UNAUTHORIZED(
        res,
        "Token is not valid",
        "Invalid token."
      );
    }
  };
};

import express from "express";
import { UserValidationSchema } from "./user.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { UserController } from "./user.controller.js";
import { authorize } from "../../middleware/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

router.get("/profile", authenticate, UserController.getProfile);
router.get(
  "/all",
  authenticate,
  authorize(ROLES.ADMIN),
  UserController.getAllUsers
);
router.put(
  "/updateRole/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(UserValidationSchema.updateRole),
  UserController.updateRole
);
router.put(
  "/update",
  authenticate,
  validate(UserValidationSchema.update),
  UserController.update
);
router.get(
  "/referrals",
  authenticate,
  UserController.getUserReferrals
);

export default router;

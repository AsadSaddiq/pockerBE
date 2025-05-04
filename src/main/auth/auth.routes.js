import express from "express";
import { AuthValidationSchema } from "./auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { AuthController } from "./auth.controller.js";
import { authorize } from "../../middleware/role.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { checkReferralPermission } from "../../middleware/checkReferralPermission.js";

const router = express.Router();

router.post(
  "/registerByAdmin",
  validate(AuthValidationSchema.registerByAdmin),
  authenticate,
  authorize(ROLES.ADMIN),
  AuthController.registerByAdmin
);
router.post(
  "/registerByReferral",
  validate(AuthValidationSchema.registerByReferral),
  AuthController.registerByReferral
);
router.post(
  "/forgotPassword",
  validate(AuthValidationSchema.forgotPassword),
  AuthController.forgotPassword
);
router.post(
  "/createReferral",
  authenticate,
  validate(AuthValidationSchema.createReferral),
  checkReferralPermission,
  AuthController.createReferral
);
router.put(
  "/referrals-reset/:referrerId",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(AuthValidationSchema.referralsReset),
  AuthController.referralsReset
);

router.post(
  "/login",
  validate(AuthValidationSchema.login),
  AuthController.loginUser
);
router.post(
  "/createNewPassword/:token",
  validate(AuthValidationSchema.createNewPassword),
  AuthController.createNewPassword
);
router.post(
  "/updatePassword",
  authenticate,
  validate(AuthValidationSchema.updatePassword),
  AuthController.updatePassword
);

export default router;

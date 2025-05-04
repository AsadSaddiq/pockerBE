import Joi from "joi";

export const AuthValidationSchema = {
  registerByReferral: {
    body: Joi.object().keys({
      userName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      referralCode: Joi.string().required(),
    }),
  },
  registerByAdmin: {
    body: Joi.object().keys({
      userName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      referredBy: Joi.string().required(),
      roles: Joi.string().required(),
      phoneNo: Joi.string().allow(null, ""),
    }),
  },
  createReferral: {
    body: Joi.object().keys({
      roles: Joi.string().required(),
      email: Joi.string().email().allow(null),
      message: Joi.string().allow(null),
    }),
  },
  referralsReset: {
    params: Joi.object().keys({
      referrerId: Joi.string().required(),
    }),
  },
  forgotPassword: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  },
  createNewPassword: {
    body: Joi.object().keys({
      password: Joi.string().required(),
    }),
    params: Joi.object().keys({
      token: Joi.string().required(),
    }),
  },
  updatePassword: {
    body: Joi.object().keys({
      password: Joi.string().required(),
    }),
  },
};

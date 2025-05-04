import Joi from "joi";

export const UserValidationSchema = {
  register: {
    body: Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      roles: Joi.string().required(),
      referralCode: Joi.string().required(),
    }),
  },
  updateRole: {
    body: Joi.object().keys({
      roles: Joi.string().required(),
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  login: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  },
  update: {
    body: Joi.object().keys({
      userName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNo: Joi.string().allow(null, ""),
      imageUrl: Joi.string().allow(null, ""),
    }),
  },
};

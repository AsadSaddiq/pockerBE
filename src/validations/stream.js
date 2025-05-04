import Joi from "joi";

export const StreamSchema = {
  add: {
    body: Joi.object().keys({
      episode_id: Joi.string().required(),
      user_id: Joi.string().required(),
      time: Joi.string().required(),
    }),
  },
  update: {
    body: Joi.object().keys({
      episode_id: Joi.string(),
      user_id: Joi.string(),
      time: Joi.string(),
    }),
  },
};

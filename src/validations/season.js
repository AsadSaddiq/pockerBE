import Joi from "joi";

export const seasonSchema = {
  add: {
    body: Joi.object().keys({
      series_id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
  update: {
    body: Joi.object().keys({
      series_id: Joi.number(),
      name: Joi.string(),
      description: Joi.string(),
    }),
  },
};

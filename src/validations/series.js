import Joi from "joi";

export const SeriesSchema = {
  add: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      trailer_id: Joi.number().required(),
      thumbnail_id: Joi.number().required(),
    }),
  },
  update: {
    body: Joi.object().keys({
      name: Joi.string(),
      description: Joi.string(),
      trailer_id: Joi.number(),
      thumbnail_id: Joi.number(),
    }),
  },
};

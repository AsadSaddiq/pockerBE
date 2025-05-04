import Joi from "joi";

export const episodeSchema = {
  add: {
    body: Joi.object().keys({
      season_id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      thumbnail_id: Joi.number().required(),
    }),
  },
  update: {
    body: Joi.object().keys({
      season_id: Joi.number(),
      name: Joi.string(),
      description: Joi.string(),
      thumbnail_id: Joi.number(),
    }),
  },
};

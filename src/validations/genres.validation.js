import Joi from "joi";

export const GenreValidationSchema = {
  add: {
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
    update: {
      body: Joi.object().keys({
        first_name: Joi.string(),
      }),
    },
  },
};

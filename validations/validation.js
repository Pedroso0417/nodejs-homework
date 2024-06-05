// validations/contactValidation.js
import Joi from 'joi';

export const contactValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

export const favoriteValidation = Joi.object({
  favorite: Joi.boolean().required()
});

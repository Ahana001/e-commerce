import Joi from 'joi';

export const gen_customer_register = Joi.object({
  name: Joi.string().min(3).max(70).trim().required(),
  password: Joi.string().trim().required(),
});

export const gen_customer_login = Joi.object({
  name: Joi.string().min(3).max(70).trim().required(),
  password: Joi.string().trim().required(),
});

export const id = Joi.string().required();
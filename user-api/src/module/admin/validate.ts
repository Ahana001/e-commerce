import Joi from 'joi';

export const gen_admin_login = Joi.object({
  name: Joi.string().min(3).max(70).trim().required(),
  password: Joi.string().required(),
});

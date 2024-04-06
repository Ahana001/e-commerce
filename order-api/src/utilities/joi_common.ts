import Joi from 'joi';

export const numeric_id = Joi.number().required();
export const id_str = Joi.string().required();

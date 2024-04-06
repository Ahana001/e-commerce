
import Joi from 'joi';
import * as joi_common from '../../utilities/joi_common';

export const verify_create_product = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim(),
  price: Joi.number().required(),
  stock: Joi.number().default(0)
});

export const verify_update_product = Joi.object({
  id: joi_common.id_str,
  name: Joi.string().trim().required(),
  stock: Joi.number(),
  description: Joi.string()
});

export const verify_delete_product = Joi.object({
  id: joi_common.id_str,
});

export const internal_product_details = Joi.object({
  ids: Joi.array().items(Joi.string())
});

export const updated_product_stock = Joi.object({
  id: Joi.string().required(),
  quantity: Joi.number().required()
});

export const internal_product_stock_update = Joi.object({
  products: Joi.array().items(updated_product_stock).min(1)
});

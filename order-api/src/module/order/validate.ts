import Joi from 'joi';
import * as joi_common from '../../utilities/joi_common';

export const get_customer_orders_as_admin = Joi.object({
  order_id: joi_common.numeric_id,
  admin_id: joi_common.id_str,
});

export const accept_customer_orders_as_admin = Joi.object({
  order_id: joi_common.numeric_id,
  admin_id: joi_common.id_str,
  accept: Joi.boolean().required(),
});

export const get_customer_orders = Joi.object({
  order_id: joi_common.numeric_id,
  customer_id: joi_common.id_str,
});

const menuItems = Joi.object({
  quantity: Joi.number().min(1).max(100).integer().required(),
  id: Joi.string().required(),
});

export const validate_place_order = Joi.object({
  customer_id: joi_common.id_str,
  products: Joi.array().items(menuItems).min(1),
});

export const confirm_payment_order_as_admin = Joi.object({
  order_id: joi_common.numeric_id,
  admin_id: joi_common.id_str,
});

export const delivered_order_as_admin = Joi.object({
  order_id: joi_common.numeric_id,
  admin_id: joi_common.id_str,
});

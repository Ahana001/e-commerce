import * as models from './models';
import * as validate from './validate';
import {Request, Response} from 'express';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';
import { IGetCustomerOrdersAsAdmin, IOrder, OrderAcceptanceStatus, OrderStatus } from './type';
import { getTransaction } from '../../data/knex';
import { IOType } from 'child_process';

export async function getOrderByOrderIdAsAdmin(req: Request, res: Response) {
  try {
    const validation = validate.get_customer_orders_as_admin.validate({
      order_id: req.params.order_id,
      admin_id: req.user.id,
    });
    if (validation.error)
      return sendError(res, 400, [
        {
          message: validation.error.details[0].message,
          code: 1000,
        },
      ]);
    const validated_req = validation.value as IGetCustomerOrdersAsAdmin;
    const records = await models.readOrdersAsAdmin([validated_req.order_id]);
    if (records.length === 0) {
      return sendError(res, 400, [
        {
          message: 'invalid order id',
          code: 1036,
        },
      ]);
    }
    return sendSuccess(res, 200, {records});
  } catch (error) {
    console.log('FAILED WHILE FETCHING ORDER DETAILS')
    sendError(res, 500, 'Internal Server Error');
  }
}

export async function acceptOrderAsAdmin(req: Request, res: Response){
  try{
     const validation = validate.accept_customer_orders_as_admin.validate({
      order_id: req.params.order_id,
      admin_id: req.user.id,
      accept: req.body.accept
    });
    if (validation.error)
      return sendError(res, 400, [
        {
          message: validation.error.details[0].message,
          code: 1000,
        },
      ]);
    const validated_req = validation.value;
    const trx = await getTransaction();
    try {
      const order_details = await models.readOrderForUpdate(trx, validated_req.order_id);
      if (!order_details) {
      await trx.rollback();
      return sendError(res, 400, [
        {
          message: 'invalid order id',
          code: 1032,
        },
      ]);
     }
     if (order_details.order_status !== OrderStatus.PLACED) {
      await trx.rollback();
      return sendError(res, 400, [
        {
          message: 'order status is not placed',
          code: 1037,
        },
      ]);
     }
      const order : IOrder = {
        id: order_details.id,
        order_acceptance_status: validated_req.accept? OrderAcceptanceStatus.ACCEPTED : OrderAcceptanceStatus.REJECTED
      }
      const updated_order = await models.updateOrder(trx, order);
      await trx.commit();
      return sendSuccess(res, 200, updated_order);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }catch{
    console.log('FAILED WHILE ACCEPTING ORDER DETAILS');
    sendError(res, 500, 'Internal Server Error');
  }
}

export async function confirmPaymentOrderAsAdmin(req: Request, res: Response){
  try{
     const validation = validate.confirm_payment_order_as_admin.validate({
      order_id: req.params.order_id,
      admin_id: req.user.id,
    });
    if (validation.error)
      return sendError(res, 400, [
        {
          message: validation.error.details[0].message,
          code: 1000,
        },
      ]);
    const validated_req = validation.value;
    const trx = await getTransaction();
    try {
      const order_details = await models.readOrderForUpdate(trx, validated_req.order_id);
      if (!order_details) {
      await trx.rollback();
      return sendError(res, 400, [
        {
          message: 'invalid order id',
          code: 1032,
        },
      ]);
     }
     if (order_details.order_status !== OrderStatus.PENDING) {
      await trx.rollback();
      return sendError(res, 400, [
        {
          message: 'invalid order status',
          code: 1037,
        },
      ]);
     }
      const order : IOrder = {
        id: order_details.id,
        order_status: OrderStatus.PLACED
      }
      const updated_order = await models.updateOrder(trx, order);
      await trx.commit();
      return sendSuccess(res, 200, updated_order);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }catch{
    console.log('FAILED WHILE CONFIRM PAYMENT ORDER DETAILS');
    sendError(res, 500, 'Internal Server Error');
  }
}

export async function deliveredOrderAsAdmin(req: Request, res: Response){
  try{
     const validation = validate.delivered_order_as_admin.validate({
      order_id: req.params.order_id,
      admin_id: req.user.id,
    });
    if (validation.error)
      return sendError(res, 400, [
        {
          message: validation.error.details[0].message,
          code: 1000,
        },
      ]);
    const validated_req = validation.value;
    const trx = await getTransaction();
    try {
      const order_details = await models.readOrderForUpdate(trx, validated_req.order_id);
      if (!order_details) {
      await trx.rollback();
      return sendError(res, 400, [
        {
          message: 'invalid order id',
          code: 1032,
        },
      ]);
     }
     if (order_details.order_status !== OrderStatus.PLACED || order_details.order_acceptance_status === OrderAcceptanceStatus.REJECTED) {
      await trx.rollback();
      return sendError(res, 400, [
        {
          message: 'order status must be placed and accepted',
          code: 1037,
        },
      ]);
     }
      const order : IOrder = {
        id: order_details.id,
        order_status: OrderStatus.COMPLETED
      }
      const updated_order = await models.updateOrder(trx, order);
      await trx.commit();
      return sendSuccess(res, 200, updated_order);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }catch{
    console.log('FAILED WHILE DELIVERED ORDER DETAILS');
    sendError(res, 500, 'Internal Server Error');
  }
}
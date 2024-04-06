import * as models from './models';
import * as validate from './validate';
import {Request, Response} from 'express';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';
import { IGetCustomerOrders, IPlaceOrderRequest } from './type';
import { createOrder, getProductsDetails, updateProductStock, validateCart } from './service';
import { getTransaction } from '../../data/knex';
// import { validateCart } from './service';
// import { getTransaction } from '../../data/knex';

export async function getCustomerOrderByOrderIdAsCustomer(
  req: Request,
  res: Response
) {
  try {
    const validation = validate.get_customer_orders.validate({
      order_id: req.params.order_id,
      customer_id: req.user.id,
    });
    if (validation.error)
      return sendError(res, 400, [
        {
          message: validation.error.details[0].message,
          code: 1000,
        },
      ]);
    const validated_req = validation.value as IGetCustomerOrders;
    const records = await models.readCustomerOrders(
      [validated_req.order_id],
      validated_req.customer_id
    );
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
    console.log('FAILED WHILE FETCHING ORDER DETAILS');
    sendError(res, 500, 'Internal Server Error');
  }
}

export async function initPaymentPlaceOrder(req: Request, res: Response) {
  try {
    req.body.customer_id = req.user.id;
    const validation = validate.validate_place_order.validate(req.body);
    
    if (validation.error)
      return sendError(res, 400, [
        {
          message: validation.error.details[0].message,
          code: 1000,
        },
      ]);
    
      const validated_req = validation.value as IPlaceOrderRequest;
      const product_ids = validated_req.products.map((product)=>product.id);
      const product_details_response = await getProductsDetails(product_ids);
      console.log(product_details_response)
      if(product_details_response.length){
        
        const { populated_cart, cart_meta_errors } = await validateCart(validated_req, product_details_response);
        if (!populated_cart.cart_status && cart_meta_errors) {
          return sendError(res, 400, cart_meta_errors)
        }
        const trx = await getTransaction();
        try {
          const {order_details} = await createOrder(trx,populated_cart);
          await updateProductStock(validated_req.products);
          await trx.commit();
          return sendSuccess(res, 200, {order_details})
        } catch (error) {
          await trx.rollback();
          throw error;
        }
      }else{
        return sendError(res, 400, [
        {
          message: 'failed to place order invalid products',
          code: 1000,
        },
      ]);
      }
  } catch (error) {
    console.log('FAILED WHILE PLACING ORDER: ')
    return sendError(res, 500, 'Internal Server Error');
  }
}
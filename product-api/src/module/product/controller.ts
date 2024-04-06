import {Request, Response} from 'express';
import * as models from './models';
import * as validate from './validate';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';
import { getTransaction } from '../../data/knex';

export async function internalReadProducts(req: Request, res: Response) {
  try {
    const validation = validate.internal_product_details.validate(req.body);
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);

    const validated_req = validation.value;

    const products = await models.getProdcutByIds(validated_req.ids);
    return sendSuccess(res, 200, {products});
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}

export async function internaUpdateProducts(req: Request, res: Response) {
  try {
    console.log(req.body);
    const validation = validate.internal_product_stock_update.validate(req.body);
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);

    const validated_req = validation.value;
    const product_ids = validated_req.products.map((product)=> product.id);
    const trx = await getTransaction();
    try {
    const products = await models.readProductForUpdate(trx, product_ids);
    const updatedRow =  validated_req.products.map((req_product)=>{
      const findProduct = products.find((exist_product)=> exist_product.id === req_product.id);
      return {id: findProduct.id, stock: findProduct.stock - req_product.quantity};
    })
    await models.bulkUpdateProduct(trx,updatedRow);
    await trx.commit();
    return sendSuccess(res, 200, {products});
    } catch (error) {
      await trx.rollback();
      sendError(res,400,error);
    }
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}
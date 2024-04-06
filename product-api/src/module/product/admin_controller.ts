
import {Request, Response} from 'express';
import * as models from './models';
import * as validate from './validate';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';
import { CheckDuplicateName } from './service';
import { getTransaction } from '../../data/knex';
import { IProduct } from './type';

export async function admin_createProduct(req: Request, res: Response) {
  try {
    const validation = validate.verify_create_product.validate(req.body);
    
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);
    const validated_req = validation.value;

    if (await CheckDuplicateName(validated_req))
      return sendError(res, 400, 'Duplicate Product Name');

    const product = await models.createProduct(validated_req);
    return sendSuccess(res, 201, product);
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}

export async function admin_readProducts(req: Request, res: Response) {
  try {
    const products = await models.readProducts();
    return sendSuccess(res, 200, products);
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}

export async function admin_updateProduct(req: Request, res: Response) {
  try {
    req.body.id = req.params.id;

    const validation = validate.verify_update_product.validate(req.body);
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);

    const validated_req = validation.value as IProduct;

    const trx = await getTransaction();
    try {
      const product = await models.readProductForUpdate(
        trx,
        [validated_req.id]
      );

      if (!product[0]) {
        await trx.rollback();
        return sendError(res,400,'Product Not Found');
      }

      if (await CheckDuplicateName(validated_req)){
        await trx.rollback();
        return sendError(res,400,'Duplicate Product Name');
      }

      const updatedProduct = await models.updateProduct(
        validated_req,
        trx
      );
      await trx.commit();
      return sendSuccess(res, 200, updatedProduct);
    } catch (error) {
      await trx.rollback();
      sendError(res,400,error);
    }
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}

export async function admin_deleteProduct(req: Request, res: Response) {
  try {
    req.body.id = req.params.id;
    const validation = validate.verify_delete_product.validate(req.body);
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);

    const validated_req = validation.value;
    const product = await models.getProdcutByIds([validated_req.id]);

    if (!product.length) return sendError(res, 404, 'Product Not Found');
    await models.deleteProduct(validated_req.id);

    return sendSuccess(res, 200, product[0]);
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}

import {Request, Response} from 'express';
import * as models from './models';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';

export async function readProducts(req: Request, res: Response) {
  try {
    const products = await models.readProducts();
    return sendSuccess(res, 200, products);
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}
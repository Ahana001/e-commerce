import * as models from './models';
import * as validate from './validate';
import {Request, Response} from 'express';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';

export async function getCustomerById(req: Request, res: Response) {
  try {
    const validation = validate.id.validate(req.user.id);
    
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);
    
    const validated_req = validation.value;
    
    const customer = await models.readCustomerById(validated_req);

    if (!customer) return sendError(res, 404, 'Customer not found');
    delete customer.password;
    return sendSuccess(res, 200, {customer: customer});
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
}
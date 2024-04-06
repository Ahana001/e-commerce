import * as models from './models';
import * as validate from './validate';
import {Request, Response} from 'express';
import signToken from '../../utilities/jwt/sign_token';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';
import { comparePassword, encryptPassword } from '../../utilities/crypto';
import { Customer, Validation_Req } from './type';

export async function genRegisterCustomer(req: Request, res: Response) {
  try {
    const validation = validate.gen_customer_register.validate(req.body);
    
    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);

    const validated_req = validation.value as Validation_Req;

    if (await models.readCustomerByName(validated_req.name)) {
      return sendError(res, 409, 'User already exists, Please login');
    }
    const customer = <Customer>{};
    customer.name = validated_req.name;
    customer.password = await encryptPassword(validated_req.password);

    const createdCustomer = await models.createCustomer(customer);
    delete createdCustomer.password;
    return sendSuccess(res, 200, {message: 'Registration Successfully', customer: createdCustomer});
  } catch (error) {
      return sendError(res, 500, 'Internal Server Error');
  }
}

export async function genLoginCustomer(req: Request, res: Response) {
  try {
    const validation = validate.gen_customer_login.validate(req.body);

    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);
    
    const validated_req = validation.value as Validation_Req;

    const customer = await models.readCustomerByName(
      validated_req.name
    );

    if (!customer) {
      return sendError(res, 400, 'User Does not Exist. Please Register.');
    }
    if(await comparePassword(validated_req.password, customer.password! )){
      const token = signToken({
        id: customer.id,
        user_type: 'customer',
    });
    delete customer.password;
    return sendSuccess(res, 200, {
      ...customer,
      token: token,
    });
    }else{
      return sendError(res, 400, 'Incorrect Credentials');
    }
    
  } catch (error) {
      return sendError(res, 500, 'Internal Server Error');
  }
}

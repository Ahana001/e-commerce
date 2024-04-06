import * as models from './models';
import * as validate from './validate';
import {Request, Response} from 'express';
import signToken from '../../utilities/jwt/sign_token';
import {
  sendError,
  sendSuccess,
} from '../../utilities/controllers/handle_response';
import { comparePassword, encryptPassword } from '../../utilities/crypto';
import { Validation_Req } from './type';

export async function genLoginAdmin(req: Request, res: Response) {
  try {
    const validation = validate.gen_admin_login.validate(req.body);

    if (validation.error)
      return sendError(res, 400, validation.error.details[0].message);
    
    const validated_req = validation.value as Validation_Req;

    const admin = await models.readAdminByName(
      validated_req.name
    );
    if (!admin) {
      return sendError(res, 400, 'Admin Does not Exist. Please Register.');
    }
    if(await comparePassword(validated_req.password, admin.password!)){
      const token = signToken({
        id: admin.id,
        user_type: 'admin',
    });
    delete admin.password;
    return sendSuccess(res, 200, {
      ...admin,
      token: token,
    });
    }else{
      return sendError(res, 400, 'Incorrect Credentials');
    }
    
  } catch (error) {
      return sendError(res, 500, 'Internal Server Error');
  }
}
import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import {sendError} from '../controllers/handle_response';
dotenv.config();

export interface user {
  id: string;
  user_type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  exp?: number;
  iat?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user: user;
      baseUrl: string;
    }
  }
}

async function authenticate_jwt(
  req: Request,
  res: Response
): Promise<user | undefined> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const key = process.env.JWT_ACCESS_PUBLIC_KEY ?? '';
  let result: user | undefined;
  if (!token) {
    sendError(res, 401, 'Authorization Error');
  } else {
    const promis = new Promise(resolve => {
      jwt.verify(
        token,
        key,
        (err, user) => {
          if (err) {
            sendError(res, 401, 'Authorization Error');
          } else {
            if (!user) {
              sendError(res, 403, 'Forbidden');
            } else {
              resolve(user);
            }
          }
        }
      );
    });
    result = (await promis) as user;
  }
  return result;
}

async function authenticate_user_type(
  req: Request,
  res: Response,
  user_type: string
): Promise<Request | undefined> {
  const user = await authenticate_jwt(req, res);
  if (user) {
    if (user.user_type !== user_type) {
      sendError(res, 403, 'forbidden');
    } else {
      req.user = user;
      return req;
    }
  }
  return undefined;
}

export async function authenticate_user(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await authenticate_jwt(req, res);
  if (user) next();
}

export async function authenticate_customer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const rq = await authenticate_user_type(req, res, 'customer');
  if (rq) {
    req = rq;
    next();
  }
}

import {Response} from 'express';
export interface IError {
  message: string;
  code: number;
  data?: any;
}

export interface IResponseError {
  status: boolean;
  statusCode: number;
  errors?: IError[];
}

export function sendSuccess(
  res: Response,
  status_code: number,
  data: any,
  message?: string
) {
  const sendData = {
    status: true,
    statusCode: status_code,
    message: message || 'Successfull Response',
    result: data,
  };
  return res.status(sendData.statusCode).send(sendData);
}
export function sendError(
  res: Response,
  status_code: number,
  error_messages: string | IError[]
) {
  const sendData: IResponseError     = {
    status: false,
    statusCode: status_code,
    errors: undefined,
  };

  if (typeof error_messages === 'string') {
    sendData.errors = [
      {
        message: error_messages,
        code: 0,
      },
    ];
  } else {
    sendData.errors = error_messages;
  }

  return res.status(sendData.statusCode).send(sendData);
}

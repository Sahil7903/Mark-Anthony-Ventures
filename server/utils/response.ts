import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
  const response: any = {
    success,
    message,
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

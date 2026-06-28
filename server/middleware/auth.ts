import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendResponse } from '../utils/response';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return sendResponse(res, 401, false, 'Not authorized, token failed');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, no token');
  }
};

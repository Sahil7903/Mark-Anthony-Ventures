import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response';

export const validateRegister = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

export const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg).join(', ');
    return sendResponse(res, 400, false, errorMessages);
  }
  next();
};

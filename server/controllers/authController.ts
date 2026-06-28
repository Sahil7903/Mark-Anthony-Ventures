import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendResponse } from '../utils/response';

// @desc    Register a member
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendResponse(res, 400, false, 'User already exists');
    }

    // Explicitly forcing role to 'member' for public registration
    const user = await User.create({
      name,
      email,
      password,
      role: 'member',
    });

    if (user) {
      sendResponse(res, 201, true, 'User registered successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id as string, user.role),
      });
    } else {
      sendResponse(res, 400, false, 'Invalid user data');
    }
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendResponse(res, 200, true, 'Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id as string, user.role),
      });
    } else {
      sendResponse(res, 401, false, 'Invalid email or password');
    }
  } catch (error: any) {
    sendResponse(res, 500, false, error.message);
  }
};

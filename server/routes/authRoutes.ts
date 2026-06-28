import express from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister, validateLogin, validate } from '../validators/authValidator';

const router = express.Router();

router.post('/register', validateRegister, validate, register);
router.post('/login', validateLogin, validate, login);

export default router;

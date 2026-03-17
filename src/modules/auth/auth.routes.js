import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from './auth.validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  resetPassword
);

export default router;

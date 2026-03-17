import { catchAsync } from '../../utils/catchAsync.js';
import {
  registerUser,
  loginUser,
  forgotPasswordService
} from './auth.services.js';
import sendCookie from '../../utils/cookie.js';
import { authLogger } from '../../utils/logger.js';

export const register = catchAsync(async (req, res, next) => {
  const { user, token } = await registerUser(req.body);
  sendCookie(res, token);
  authLogger.info(
    `User: ${user.fullName} : ${user.id} registered successfully`
  );
  res.status(201).json({
    status: 'success',
    data: {
      user,
      token
    }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { user, token } = await loginUser(req.body);
  sendCookie(res, token);
  authLogger.info(`User: ${user.fullName} : ${user.id} logged in successfully`);
  res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = await forgotPasswordService(req.body.email);
  res.status(200).json({
    status: 'success',
    data: {
      resetToken
    }
  });
});

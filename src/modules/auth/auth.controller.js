import { catchAsync } from '../../utils/catchAsync.js';
import {
  registerUser,
  loginUser,
  forgotPasswordService,
  resetPasswordService
} from './auth.services.js';
import sendCookie from '../../utils/cookie.js';
import { authLogger } from '../../utils/logger.js';
import { emailQueue } from '../../queues/email/emailQueue.js';

export const register = catchAsync(async (req, res, next) => {
  const { user, token } = await registerUser(req.body);
  sendCookie(res, token);
  emailQueue.add('sendEmail', {
    to: user.email,
    subject: 'Welcome to Sandbox Judge',
    text: 'Thank you for registering with Sandbox Judge.'
  });
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
  emailQueue.add('sendEmail', { to: user.email, subject: 'Welcome to Sandbox Judge', text: 'Thank you for logging in to Sandbox Judge.' });
  res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const token = await forgotPasswordService(req.body.email);
  emailQueue.add('sendEmail', {
    to: req.body.email,
    subject: 'Password Reset',
    text: `You requested a password reset. Use the following token to reset your password: ${token}`,
    html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><strong>${token}</strong></p>`
  });
  res.status(200).json({
    status: 'success',
    message: 'Password reset email sent. Please check your inbox.'
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  await resetPasswordService(req.params.token, req.body.newPassword);
  emailQueue.add('sendEmail', {
    to: req.body.email,
    subject: 'Password Reset Successful',
    text: 'Your password has been reset successfully. You can now log in with your new password.',
    html: `<p>Your password has been reset successfully. You can now log in with your new password.</p>`
  });
  res.status(200).json({
    status: 'success',
    message:
      'Password reset successful. You can now log in with your new password.'
  });
});

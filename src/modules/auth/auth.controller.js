import { catchAsync } from '../../utils/catchAsync.js';
import { registerUser, loginUser } from './auth.services.js';

export const register = catchAsync(async (req, res, next) => {
  const { user, token } = await registerUser(req.body);
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
  res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  });
});

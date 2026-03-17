import User from './user.model.js';
import { catchAsync } from '../../utils/catchAsync.js';
import AppError from '../../utils/AppError.js';
import {
  getAllUsersService,
  getUserService,
  leaderboardService,
  updateMeService,
  deleteMeService
} from './user.services.js';
import { client } from '../../config/redis.js';
import { cacheData } from '../../utils/cacheData.js';

const getAllUsers = catchAsync(async (req, res) => {
  const users = await getAllUsersService(req.query);
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, users, 3600);
  }
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await getUserService(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, user, 3600);
  }
  await client.set(req.originalUrl, JSON.stringify(user), { EX: 3600 });
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('solvedProblems');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, user, 3600);
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (res.locals.cacheKey) {
    await client.del(res.locals.cacheKey);
  }
  res.status(204).send();
});

const leaderboard = catchAsync(async (req, res) => {
  const users = await leaderboardService();
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  const updatedUser = await updateMeService(req.user.id, req.body);

  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, updatedUser, 3600);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await deleteMeService(req.user.id);

  if (res.locals.cacheKey) {
    await client.del(res.locals.cacheKey);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  leaderboard,
  updateMe,
  deleteMe
};

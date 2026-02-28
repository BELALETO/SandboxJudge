import User from './user.model.js';
import { catchAsync } from '../../utils/catchAsync.js';
import AppError from '../../utils/AppError.js';
import {
  getAllUsersService,
  getUserService,
  leaderboardService,
  getSubmissionsService
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

const getSubmissions = catchAsync(async (req, res) => {
  const submissions = await getSubmissionsService(req.params.id);
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, submissions, 3600);
  }
  res.status(200).json(submissions);
});

export {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  leaderboard,
  getSubmissions
};

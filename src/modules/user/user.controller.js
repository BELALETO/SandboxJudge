import User from './user.model.js';
import { catchAsync } from '../../utils/catchAsync.js';
import AppError from '../../utils/AppError.js';
import { getAllUsersService, getUserService } from './user.services.js';

const getAllUsers = catchAsync(async (req, res) => {
  const users = await getAllUsersService(req.query);
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
  res.status(204).send();
});

export { getAllUsers, getUser, updateUser, deleteUser };

import User from './user.model.js';
import AppError from '../../utils/AppError.js';
import Query from '../../utils/query.js';

const getAllUsersService = async (queryString) => {
  const query = new Query(User.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await query.query.populate('solvedProblems');
  return users;
};

const getUserService = async (id) => {
  const user = await User.findById(id).populate('solvedProblems');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

const leaderboardService = async () => {
  const users = await User.find({ score: { $gt: 0 } })
    .sort({ score: -1 })
    .limit(10)
    .select('firstName lastName score rank');
  return users;
};

const updateMeService = async (userId, body) => {
  if (body.password || body.passwordConfirm) {
    throw new AppError(
      'This route is not for password updates. Please use /updateMyPassword.',
      400
    );
  }

  const allowedFields = ['firstName', 'lastName', 'email'];
  const filteredBody = {};
  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = body[el];
  });

  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true
  });

  return updatedUser;
};

const deleteMeService = async (userId) => {
  await User.findByIdAndDelete(userId);
};

export {
  getAllUsersService,
  getUserService,
  leaderboardService,
  updateMeService,
  deleteMeService
};

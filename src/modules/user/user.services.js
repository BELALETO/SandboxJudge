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
  const users = await User.aggregate([
    {
      $match: { score: { $gt: 0 }, $and: { rank: { $ne: 'Bronze' } } }
    },
    {
      $group: {
        _id: '$rank',
        numberOfUsers: { $sum: 1 }
      }
    },
    { $sort: { score: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        rank: '$_id',
        numberOfUsers: 1
      }
    }
  ]);
  return users;
};

export { getAllUsersService, getUserService, leaderboardService };

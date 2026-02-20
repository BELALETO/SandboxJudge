import express from 'express';

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  leaderboard
} from './user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/leaderboard').get(leaderboard);

export default router;

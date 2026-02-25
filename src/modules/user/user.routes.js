import express from 'express';

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  leaderboard
} from './user.controller.js';
import { cacheMiddleware } from '../../middlewares/cache.js';

const router = express.Router();

router.route('/').get(cacheMiddleware, getAllUsers);
router
  .route('/:id')
  .get(cacheMiddleware, getUser)
  .patch(updateUser)
  .delete(deleteUser);
router.route('/leaderboard').get(leaderboard);

export default router;

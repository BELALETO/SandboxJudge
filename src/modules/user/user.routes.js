import express from 'express';

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  leaderboard,
  updateMe,
  deleteMe
} from './user.controller.js';
import { cacheMiddleware } from '../../middlewares/cache.js';
import restrictTo from '../../middlewares/restrictTo.js';
import protect from '../../middlewares/protect.js';

const router = express.Router();

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/leaderboard').get(leaderboard);

router
  .route('/')
  .get(protect, restrictTo('Admin'), cacheMiddleware('users'), getAllUsers);
router
  .route('/:id')
  .get(cacheMiddleware('user'), getUser)
  .patch(protect, restrictTo('Admin'), updateUser)
  .delete(protect, restrictTo('Admin'), deleteUser);

export default router;

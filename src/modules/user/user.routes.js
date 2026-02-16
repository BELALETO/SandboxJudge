import express from 'express';

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from './user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;

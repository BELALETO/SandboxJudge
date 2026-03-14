import express from 'express';
import {
  createSubmission,
  getSubmissionById,
  getAllSubmisssoins
} from './submission.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createSubmissionSchema } from './submission.validate.js';
import { cacheMiddleware } from '../../middlewares/cache.js';
import protect from '../../middlewares/protect.js';
import restrictTo from '../../middlewares/restrictTo.js';

const router = express.Router();

router
  .route('/')
  .get(
    protect,
    restrictTo('Admin', 'User'),
    // cacheMiddleware('Submission'),
    getAllSubmisssoins
  )
  .post(
    protect,
    restrictTo('Admin', 'User'),
    validate(createSubmissionSchema),
    createSubmission
  );

//* An endpoint spical for getting a specific submission by its id.

router.get('/:id', protect, cacheMiddleware('submission'), getSubmissionById);

export default router;

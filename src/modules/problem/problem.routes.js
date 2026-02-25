import {
  createProblem,
  getProblems,
  getProblemBySlug,
  updateProblem,
  deleteProblem
} from './problem.controller.js';
import { cacheMiddleware } from '../../middlewares/cache.js';

import {
  createProblemSchema,
  updateProblemSchema
} from './problem.validate.js';

import { validate } from '../../middlewares/validate.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .post(validate(createProblemSchema), createProblem)
  .get(cacheMiddleware, getProblems);

router
  .route('/:slug')
  .get(cacheMiddleware, getProblemBySlug)
  .patch(validate(updateProblemSchema), updateProblem)
  .delete(deleteProblem);

export default router;

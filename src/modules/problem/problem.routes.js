import {
  createProblem,
  getProblems,
  getProblemBySlug,
  updateProblem,
  deleteProblem
} from './problem.controller.js';

import {
  createProblemSchema,
  updateProblemSchema
} from './problem.validate.js';

import express from 'express';

const router = express.Router();

router.route('/').post(createProblemSchema, createProblem).get(getProblems);

router
  .route('/:slug')
  .get(getProblemBySlug)
  .put(updateProblemSchema, updateProblem)
  .delete(deleteProblem);

export default router;

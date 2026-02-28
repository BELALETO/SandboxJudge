import {
  createProblem as createProblemService,
  getProblems as getProblemsService,
  getProblemBySlug as getProblemBySlugService,
  updateProblem as updateProblemService,
  deleteProblem as deleteProblemService
} from './problem.services.js';

import { catchAsync } from '../../utils/catchAsync.js';
import { client } from '../../config/redis.js';
import { cacheData } from '../../utils/cacheData.js';
import { problemLogger } from '../../utils/logger.js';

export const createProblem = catchAsync(async (req, res) => {
  const problem = await createProblemService(req.body);
  problemLogger.info(
    `Problem created successfully: ${problem.slug} : ${problem.id}`
  );
  res.status(201).json({
    status: 'success',
    data: problem
  });
});

export const getProblems = catchAsync(async (req, res) => {
  const problems = await getProblemsService(req.query);
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, problems, 3600);
  }
  res.status(200).json({
    status: 'success',
    results: problems.length,
    data: problems
  });
});

export const getProblemBySlug = catchAsync(async (req, res, next) => {
  const problem = await getProblemBySlugService(req.params.slug);
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, problem, 3600);
  }
  res.status(200).json({
    status: 'success',
    data: problem
  });
});

export const updateProblem = catchAsync(async (req, res, next) => {
  const problem = await updateProblemService(req.params.slug, req.body);

  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, problem, 3600);
  }
  problemLogger.info(
    `Problem updated successfully: ${problem.slug} : ${problem.id}`
  );
  res.status(200).json({
    status: 'success',
    data: problem
  });
});

export const deleteProblem = catchAsync(async (req, res, next) => {
  const problem = await deleteProblemService(req.params.slug);
  if (res.locals.cacheKey) {
    await client.del(res.locals.cacheKey);
  }
  problemLogger.info(
    `Problem deleted successfully: ${problem.slug} : ${problem.id}`
  );
  res.status(204).send();
});

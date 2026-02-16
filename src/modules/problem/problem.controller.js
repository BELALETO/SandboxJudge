import {
  createProblem as createProblemService,
  getProblems as getProblemsService,
  getProblemBySlug as getProblemBySlugService,
  updateProblem as updateProblemService,
  deleteProblem as deleteProblemService
} from './problem.services.js';

import { catchAsync } from '../../utils/catchAsync.js';
import AppError from '../../utils/AppError.js';

export const createProblem = catchAsync(async (req, res) => {
  const problem = await createProblemService(req.body);
  res.status(201).json({
    status: 'success',
    data: problem
  });
});

export const getProblems = catchAsync(async (req, res) => {
  const problems = await getProblemsService();
  res.status(200).json({
    status: 'success',
    results: problems.length,
    data: problems
  });
});

export const getProblemBySlug = catchAsync(async (req, res, next) => {
  const problem = await getProblemBySlugService(req.params.slug);
  if (!problem) {
    return next(new AppError('Problem not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: problem
  });
});

export const updateProblem = catchAsync(async (req, res, next) => {
  const problem = await updateProblemService(req.params.slug, req.body);
  if (!problem) {
    return next(new AppError('Problem not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: problem
  });
});

export const deleteProblem = catchAsync(async (req, res, next) => {
  const problem = await deleteProblemService(req.params.slug);
  if (!problem) {
    return next(new AppError('Problem not found', 404));
  }
  res.status(204).send();
});

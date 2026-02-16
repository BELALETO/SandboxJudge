import {
  createProblem as createProblemService,
  getProblems as getProblemsService,
  getProblemBySlug as getProblemBySlugService,
  updateProblem as updateProblemService,
  deleteProblem as deleteProblemService
} from './problem.service.js';

export const createProblem = async (req, res, next) => {
  try {
    const problem = await createProblemService(req.body);
    res.status(201).json({
      status: 'success',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

export const getProblems = async (req, res, next) => {
  try {
    const problems = await getProblemsService();
    res.status(200).json({
      status: 'success',
      data: problems
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemBySlug = async (req, res, next) => {
  try {
    const problem = await getProblemBySlugService(req.params.slug);
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    const problem = await updateProblemService(req.params.slug, req.body);
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await deleteProblemService(req.params.slug);
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

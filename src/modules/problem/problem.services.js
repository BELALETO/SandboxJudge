import Problem from './problem.model.js';
import AppError from '../../utils/AppError.js';
import Query from '../../utils/query.js';

export const createProblem = async (problemData) => {
  const problem = await Problem.create(problemData);
  return problem;
};

export const getProblems = async (queryString) => {
  const query = new Query(Problem.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const problems = await query.query;
  return problems;
};

export const getProblemBySlug = async (slug) => {
  const problem = await Problem.findOne({ slug });
  if (!problem) {
    throw new AppError('Problem not found', 404);
  }
  return problem;
};

export const updateProblem = async (slug, updateData) => {
  const problem = await Problem.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true
  });
  if (!problem) {
    throw new AppError('Problem not found', 404);
  }
  return problem;
};

export const deleteProblem = async (slug) => {
  const problem = await Problem.findOneAndDelete({ slug });
  if (!problem) {
    throw new AppError('Problem not found', 404);
  }
  return problem;
};

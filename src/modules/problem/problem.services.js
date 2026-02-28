import Problem from './problem.model.js';
import AppError from '../../utils/AppError.js';
import Query from '../../utils/query.js';

export const createProblem = async (problemData) => {
  const problem = await Problem.create(problemData);
  const sanitizedProblem = {
    id: problem._id,
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt
  };
  return sanitizedProblem;
};

export const getProblems = async (queryString) => {
  const query = new Query(Problem.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const problems = await query.query;
  problems.forEach((problem) => {
    problem.id = problem._id;
    delete problem._id;
    delete problem.__v;
  });
  return problems;
};

export const getProblemBySlug = async (slug) => {
  const problem = await Problem.findOne({ slug });
  if (!problem) {
    throw new AppError('Problem not found', 404);
  }
  const sanitizedProblem = {
    id: problem._id,
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt
  };
  return sanitizedProblem;
};

export const updateProblem = async (slug, updateData) => {
  const problem = await Problem.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true
  });
  if (!problem) {
    throw new AppError('Problem not found', 404);
  }
  const sanitizedProblem = {
    id: problem._id,
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt
  };
  return sanitizedProblem;
};

export const deleteProblem = async (slug) => {
  const problem = await Problem.findOneAndDelete({ slug });
  if (!problem) {
    throw new AppError('Problem not found', 404);
  }
  const sanitizedProblem = {
    id: problem._id,
    title: problem.title,
    slug: problem.slug
  };
  return sanitizedProblem;
};

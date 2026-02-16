import Problem from './problem.model.js';

export const createProblem = async (problemData) => {
  const problem = await Problem.create(problemData);
  return problem;
};

export const getProblems = async () => {
  const problems = await Problem.find();
  return problems;
};

export const getProblemBySlug = async (slug) => {
  const problem = await Problem.findOne({ slug });
  return problem;
};

export const updateProblem = async (slug, updateData) => {
  const problem = await Problem.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true
  });
  return problem;
};

export const deleteProblem = async (slug) => {
  const problem = await Problem.findOneAndDelete({ slug });
  return problem;
};

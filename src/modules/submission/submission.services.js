import { Submission } from './submission.model.js';
import User from '../user/user.model.js';
import Problem from '../problem/problem.model.js';
import AppError from '../../utils/AppError.js';

const createSubmission = async (submissionData) => {
  const submission = await Submission.create(submissionData);
  // Simulate code execution and update submission status
  // In a real implementation, you would integrate with a code execution service
  setTimeout(async () => {
    // const isAccepted = Math.random() > 0.5; // Randomly accept or reject
    const isAccepted = true; // For testing, always accept
    submission.status = isAccepted ? 'Accepted' : 'Wrong Answer';
    if (isAccepted) {
      const user = await User.findById(submission.user);
      const problem = await Problem.findById(submission.problem);
      await user.addSolvedProblem(problem._id);
      await user.updateScore(problem._id);
      user.updateRank();
      await user.save({ validateBeforeSave: false });
    }
    submission.executionTime = Math.floor(Math.random() * 1000); // Simulate execution time
    submission.memoryUsage = Math.floor(Math.random() * 256); // Simulate memory usage
    await submission.save();
  }, 2000); // Simulate a delay for code execution
  return submission;
};

//* Get a single submission by ID
const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id)
    .populate('user', 'firstName lastName fullName')
    .populate('problem', 'title');
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }
  return submission;
};

const deleteSubmission = async (id) => {
  const submission = await Submission.findByIdAndDelete(id);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }
  return submission;
};

export { createSubmission, getSubmissionById, deleteSubmission };

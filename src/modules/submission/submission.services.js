import { Submission } from './submission.model.js';
import AppError from '../../utils/AppError.js';
import { buildQueue } from '../../queues/build/buildQueue.js';

const createSubmission = async (submissionData) => {
  const submission = await Submission.create(submissionData);

  await buildQueue.add('build', {
    submissionId: submission._id
  });

  return submission;
};

const getAllSubmisssoins = async (userId) => {
  console.log('userId :>> ', userId);
  const submissions = await Submission.find({ user: userId })
    .populate('user', 'firstName lastName fullName')
    .populate('problem', 'title');
  return submissions;
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

export {
  createSubmission,
  getSubmissionById,
  deleteSubmission,
  getAllSubmisssoins
};

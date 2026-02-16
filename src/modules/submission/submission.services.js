import { Submission } from './submission.model';

const createSubmission = async (submissionData) => {
  const submission = await Submission.create(submissionData);
  return submission;
};

const getSubmissions = async () => {
  const submissions = await Submission.find()
    .populate('user', 'username')
    .populate('problem', 'title');
  return submissions;
};

const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id)
    .populate('user', 'username')
    .populate('problem', 'title');
  return submission;
};

const deleteSubmission = async (id) => {
  const submission = await Submission.findByIdAndDelete(id);
  return submission;
};

export {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  deleteSubmission
};

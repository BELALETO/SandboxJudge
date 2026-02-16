import {
  createSubmission as createSubmissionService,
  getSubmissions as getSubmissionsService,
  getSubmissionById as getSubmissionByIdService,
  deleteSubmission as deleteSubmissionService
} from './submission.services';

export const createSubmission = async (req, res) => {
  try {
    const submission = await createSubmissionService(req.body);
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const submissions = await getSubmissionsService();
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await getSubmissionByIdService(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const submission = await deleteSubmissionService(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

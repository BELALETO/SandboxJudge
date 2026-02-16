import {
  createSubmission as createSubmissionService,
  getSubmissions as getSubmissionsService,
  getSubmissionById as getSubmissionByIdService,
  deleteSubmission as deleteSubmissionService
} from './submission.services';

import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../utils/AppError';

export const createSubmission = catchAsync(async (req, res) => {
  const submission = await createSubmissionService({
    user: req.user._id,
    problem: req.body.problem,
    code: req.body.code,
    language: req.body.language
  });
  res.status(201).json(submission);
});

export const getSubmissions = catchAsync(async (req, res) => {
  const submissions = await getSubmissionsService();
  res.status(200).json(submissions);
});

export const getSubmissionById = catchAsync(async (req, res, next) => {
  const submission = await getSubmissionByIdService(req.params.id);
  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }
  res.status(200).json(submission);
});

export const deleteSubmission = catchAsync(async (req, res, next) => {
  const submission = await deleteSubmissionService(req.params.id);
  if (!submission) {
    return next(new AppError('Submission not found', 404));
  }
  res.status(204).send();
});

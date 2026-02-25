import {
  createSubmission as createSubmissionService,
  getSubmissions as getSubmissionsService,
  getSubmissionById as getSubmissionByIdService,
  deleteSubmission as deleteSubmissionService
} from './submission.services.js';

import { catchAsync } from '../../utils/catchAsync.js';
import { client } from '../../config/redis.js';

export const createSubmission = catchAsync(async (req, res) => {
  const submission = await createSubmissionService(req.body);
  res.status(201).json(submission);
});

export const getSubmissions = catchAsync(async (req, res) => {
  const submissions = await getSubmissionsService(req.params.id);
  await client.set(req.originalUrl, JSON.stringify(submissions), { EX: 3600 });
  res.status(200).json(submissions);
});

export const getSubmissionById = catchAsync(async (req, res, next) => {
  const submission = await getSubmissionByIdService(req.params.id);
  await client.set(req.originalUrl, JSON.stringify(submission), { EX: 3600 });
  res.status(200).json(submission);
});

export const deleteSubmission = catchAsync(async (req, res, next) => {
  await deleteSubmissionService(req.params.id);
  res.status(204).send();
});

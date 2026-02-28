import {
  createSubmission as createSubmissionService,
  getSubmissionById as getSubmissionByIdService,
  deleteSubmission as deleteSubmissionService
} from './submission.services.js';

import { catchAsync } from '../../utils/catchAsync.js';
import { client } from '../../config/redis.js';
import { cacheData } from '../../utils/cacheData.js';
import { submitLogger } from '../../utils/logger.js';

export const createSubmission = catchAsync(async (req, res) => {
  const submission = await createSubmissionService(req.body);
  submitLogger.info(`Submission created successfully: ${submission.id}`);
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, submission, 3600);
  }
  res.status(201).json(submission);
});

export const getSubmissionById = catchAsync(async (req, res, next) => {
  const submission = await getSubmissionByIdService(req.params.id);
  if (res.locals.cacheKey) {
    await cacheData(res.locals.cacheKey, submission, 3600);
  }
  res.status(200).json(submission);
});

export const deleteSubmission = catchAsync(async (req, res, next) => {
  await deleteSubmissionService(req.params.id);
  if (res.locals.cacheKey) {
    await client.del(res.locals.cacheKey);
  }
  res.status(204).send();
});

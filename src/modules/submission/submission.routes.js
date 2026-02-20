import express from 'express';
import {
  createSubmission,
  getSubmissions,
  getSubmissionById
} from './submission.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createSubmissionSchema } from './submission.validate.js';

const router = express.Router();

router.post('/', validate(createSubmissionSchema), createSubmission);
router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);

export default router;

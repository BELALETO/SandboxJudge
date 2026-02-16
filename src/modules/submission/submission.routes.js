import express from 'express';
import { createSubmission, getSubmissions } from './submission.controller.js';
import validate from '../../middleware/validate.js';
import { createSubmissionSchema } from './submission.validation.js';

const router = express.Router();

router.post('/', validate(createSubmissionSchema), createSubmission);
router.get('/', getSubmissions);

export default router;

import express from 'express';
import { createSubmission, getSubmissions } from './submission.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createSubmissionSchema } from './submission.validate.js';

const router = express.Router();

router.post('/', validate(createSubmissionSchema), createSubmission);
router.get('/:id', getSubmissions);

export default router;

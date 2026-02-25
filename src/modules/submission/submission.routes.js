import express from 'express';
import { createSubmission, getSubmissions } from './submission.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createSubmissionSchema } from './submission.validate.js';
import { cacheMiddleware } from '../../middlewares/cache.js';

const router = express.Router();

router.post('/', validate(createSubmissionSchema), createSubmission);
router.get('/:id', cacheMiddleware, getSubmissions);

export default router;

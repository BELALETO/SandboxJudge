import express from 'express';
import { register } from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema } from './auth.validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);

export default router;

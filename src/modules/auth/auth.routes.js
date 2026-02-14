import express from 'express';
import { register, login } from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema } from './auth.validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;

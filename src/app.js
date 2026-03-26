import express from 'express';
import morgan from 'morgan';
import problemRouter from './modules/problem/problem.routes.js';
import userRouter from './modules/user/user.routes.js';
import authRouter from './modules/auth/auth.routes.js';
import submissionRouter from './modules/submission/submission.routes.js';
import AppError from './utils/AppError.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express();

app.set('query parser', 'extended');
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/submit', submissionRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//TODO: A test route to run code without logging in.


app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello express :)'
  });
});

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;

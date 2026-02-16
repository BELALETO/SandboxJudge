import express from 'express';
import morgan from 'morgan';
import passport from './config/passport.js';
import problemRouter from './modules/problem/problem.routes.js';
import userRouter from './modules/user/user.routes.js';
import authRouter from './modules/auth/auth.routes.js';
import AppError from './utils/AppError.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/problems', problemRouter);

app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello express :)'
  });
});

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error'
  });
});

export default app;

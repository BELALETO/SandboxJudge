import express from 'express';
import morgan from 'morgan';
import userRouter from './modules/user/user.routes.js';
import authRouter from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello express :)'
  });
});

export default app;

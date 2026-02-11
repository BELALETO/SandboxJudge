import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello express :)'
  });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

export { port, host, app };

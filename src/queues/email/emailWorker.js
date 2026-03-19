import { Worker } from 'bullmq';
import { connectDB } from '../../config/db.js';
import config from '../../config/config.js';
import AppError from '../../utils/AppError.js';
import { appLogger } from '../../utils/logger.js';
import { sendEmail } from '../../utils/sendEmail.js';

const { redisURL } = config;

await connectDB();

const connection = { url: redisURL };

export const emailWorker = new Worker('emailQueue', async (job) => {
  const { to, subject, text } = job.data;
  await sendEmail(to, subject, text);
}, {
  connection
});

emailWorker.on('completed', (job) => {
  appLogger.info(`Email sent successfully to ${job.data.to}`);
});

emailWorker.on('failed', (job, error) => {
  appLogger.error(`Failed to send email to ${job.data.to}: ${error}`);
  throw new AppError('Failed to send email', 500);
});

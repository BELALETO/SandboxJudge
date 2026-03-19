import { Queue } from 'bullmq';
import config from '../../config/config.js';

const { redisURL } = config;

export const emailQueue = new Queue('emailQueue', {
  connection: { url: redisURL }
});

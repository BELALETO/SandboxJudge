import { Queue } from 'bullmq';
import config from '../../config/config.js';

const { redisURL } = config;

export const buildQueue = new Queue('buildQueue', {
  connection: { url: redisURL }
});

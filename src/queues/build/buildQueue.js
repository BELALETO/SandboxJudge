import { Queue } from 'bullmq';

export const buildQueue = new Queue('buildQueue', {
  connection: { port: 6379, host: '127.0.0.1' }
});

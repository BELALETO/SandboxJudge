import redis from 'redis';
import { catchAsync } from '../utils/catchAsync.js';
import { appLogger } from '../utils/logger.js';
import config from './config.js';

const { redisURL } = config;

const client = redis.createClient({ url: redisURL });

client.on('error', (err) => {
  appLogger.error('Redis Error:', err);
});

const connectRedis = catchAsync(async () => {
  await client.connect();
  appLogger.info('Connected to Redis');
});

const disconnectRedis = catchAsync(async () => {
  await client.quit();
  appLogger.info('Disconnected from Redis');
});

export { client, connectRedis, disconnectRedis };

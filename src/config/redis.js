import redis from 'redis';
import { catchAsync } from '../utils/catchAsync.js';

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

const connectRedis = catchAsync(async () => {
  await client.connect();
  console.log('Connected to Redis');
});

const disconnectRedis = catchAsync(async () => {
  await client.quit();
  console.log('Disconnected from Redis');
});

export { client, connectRedis, disconnectRedis };

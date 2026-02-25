import { client } from '../config/redis.js';
import { catchAsync } from '../utils/catchAsync.js';

const cacheMiddleware = catchAsync(async (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = await client.get(key);

  if (cachedData) {
    console.log('Cached data :)');
    return res.json(JSON.parse(cachedData));
  }

  next();
});

export { cacheMiddleware };

import { client } from '../config/redis.js';
import { buildCacheKey } from '../utils/cacheKeyBuilder.js';
import { catchAsync } from '../utils/catchAsync.js';

export const cacheMiddleware = (prefix = 'cache') =>
  catchAsync(async (req, res, next) => {
    const key = buildCacheKey(req, prefix);
    const cachedData = await client.get(key);

    if (cachedData) {
      console.log(`[CACHE HIT] ${key}`);
      return res.json(JSON.parse(cachedData));
    }

    // Attach key to res.locals so service can cache later
    res.locals.cacheKey = key;
    next();
  });

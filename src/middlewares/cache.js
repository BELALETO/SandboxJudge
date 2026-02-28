import { client } from '../config/redis.js';
import { buildCacheKey } from '../utils/cacheKeyBuilder.js';
import { catchAsync } from '../utils/catchAsync.js';
import { appLogger } from '../utils/logger.js';

export const cacheMiddleware = (prefix = 'cache') =>
  catchAsync(async (req, res, next) => {
    const key = buildCacheKey(req, prefix);
    const cachedData = await client.get(key);

    if (cachedData) {
      appLogger.debug(`[CACHE HIT] ${key}`);
      return res.json(JSON.parse(cachedData));
    }

    res.locals.cacheKey = key;
    next();
  });

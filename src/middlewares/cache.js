import { client } from '../config/redis';
import { catchAsync } from '../utils/catchAsync';

const cacheMiddleware = catchAsync(async (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = await client.get(key);

  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  next();
});

export { cacheMiddleware };

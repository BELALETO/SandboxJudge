import { client } from '../config/redis.js';

export const cacheData = async (key, data, ttl = 120) => {
  if (!key || !data) return;
  await client.setEx(key, ttl, JSON.stringify(data));
};

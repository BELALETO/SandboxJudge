import redis from 'redis';

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

const connectRedis = async () => {
  await client.connect();
  console.log('Redis client connected to server successfully!');
};

export { client, connectRedis };

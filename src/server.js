import server from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import config from './config/config.js';
import { connectRedis } from './config/redis.js';

const { port, host } = config;

async function startServer() {
  try {
    await connectRedis();
    await connectDB();

    const listener = server.listen(port, host, () => {
      console.log(`Server running on ${host}:${port}`);
    });

    // Centralized shutdown logic
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);

      // Close the server first to stop accepting new requests
      listener.close(async () => {
        try {
          await disconnectDB();
          console.log('Process exiting.');
          process.exit(0);
        } catch (err) {
          console.error('Error during database disconnection:', err);
          process.exit(1);
        }
      });

      // Force exit if shutdown takes too long (e.g., 10 seconds)
      setTimeout(() => {
        console.error('Shutdown timed out, forcing exit.');
        process.exit(1);
      }, 10000);
    };

    ['SIGINT', 'SIGTERM'].forEach((signal) =>
      process.on(signal, () => shutdown(signal))
    );

    // Global error safety nets
    process.on('unhandledRejection', (reason) => {
      throw reason;
    });
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

startServer();

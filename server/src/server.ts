import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function startServer(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.info(`API server listening on http://localhost:${env.port}`);
  });

  const shutdown = async (signal: string) => {
    console.info(`${signal} received. Shutting down server...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

startServer().catch((error: unknown) => {
  console.error('Unable to start server', error);
  process.exit(1);
});
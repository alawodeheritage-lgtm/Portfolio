import 'dotenv/config';

type NodeEnvironment = 'development' | 'test' | 'production';

const nodeEnvironment = process.env.NODE_ENV ?? 'development';

if (!['development', 'test', 'production'].includes(nodeEnvironment)) {
  throw new Error('NODE_ENV must be development, test, or production');
}

const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
  throw new Error('MONGODB_URI is required');
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required');
}

export const env = {
  nodeEnvironment: nodeEnvironment as NodeEnvironment,
  port: Number(process.env.PORT ?? 4000),
  mongodbUri,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  cookieName: process.env.COOKIE_NAME ?? 'portfolio_session',
  sessionSecret,
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}
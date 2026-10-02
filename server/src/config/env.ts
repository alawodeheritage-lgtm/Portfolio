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

const brevoApiKey = process.env.BREVO_API_KEY ?? '';
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS ?? 'noreply@example.com';
const emailFromName = process.env.EMAIL_FROM_NAME ?? 'Portfolio';
const smtpHost = process.env.SMTP_HOST ?? 'smtp-relay.brevo.com';
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUsername = process.env.SMTP_USERNAME ?? '';
const smtpPassword = process.env.SMTP_PASSWORD ?? '';

export const env = {
  nodeEnvironment: nodeEnvironment as NodeEnvironment,
  port: Number(process.env.PORT ?? 4000),
  mongodbUri,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  cookieName: process.env.COOKIE_NAME ?? 'portfolio_session',
  sessionSecret,
  brevoApiKey,
  emailFromAddress,
  emailFromName,
  smtpHost,
  smtpPort,
  smtpUsername,
  smtpPassword,
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}
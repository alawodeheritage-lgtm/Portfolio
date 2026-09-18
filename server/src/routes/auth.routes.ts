import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateLogin } from '../validators/auth.validators.js';

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

export const authRouter = Router();

authRouter.post('/login', loginRateLimit, validateLogin, login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);

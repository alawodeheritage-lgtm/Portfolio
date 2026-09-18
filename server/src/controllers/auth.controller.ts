import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import { AdminModel } from '../models/Admin.js';
import { SessionModel } from '../models/Session.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  SESSION_MAX_AGE_MS,
  createSessionToken,
  getCookieValue,
  hashSessionToken,
} from '../utils/session.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnvironment === 'production',
  sameSite: env.nodeEnvironment === 'production' ? ('none' as const) : ('lax' as const),
  maxAge: SESSION_MAX_AGE_MS,
  path: '/',
};

function safeAdmin(admin: { _id: { toString(): string }; email: string }) {
  return { id: admin._id.toString(), email: admin.email };
}

export const login: RequestHandler = asyncHandler(async (request, response) => {
  const email = request.body.email as string;
  const password = request.body.password as string;
  const admin = await AdminModel.findOne({ email }).select('+passwordHash');

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const rawToken = createSessionToken();
  await SessionModel.create({
    adminId: admin._id,
    tokenHash: hashSessionToken(rawToken),
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS),
  });

  response.cookie(env.cookieName, rawToken, cookieOptions);
  response.status(200).json({ admin: safeAdmin(admin) });
});

export const me: RequestHandler = asyncHandler(async (request, response) => {
  if (!request.authenticatedAdmin) {
    throw new HttpError(401, 'Authentication required');
  }

  response.status(200).json({ admin: request.authenticatedAdmin });
});

export const logout: RequestHandler = asyncHandler(async (request, response) => {
  const rawToken = getCookieValue(request.headers.cookie, env.cookieName);

  if (rawToken) {
    await SessionModel.deleteOne({ tokenHash: hashSessionToken(rawToken) });
  }

  response.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: '/',
  });
  response.status(204).send();
});

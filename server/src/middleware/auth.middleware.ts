import type { RequestHandler } from 'express';
import { AdminModel } from '../models/Admin.js';
import { SessionModel } from '../models/Session.js';
import { env } from '../config/env.js';
import { getCookieValue, hashSessionToken } from '../utils/session.js';
import { HttpError } from '../utils/httpError.js';

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const rawToken = getCookieValue(request.headers.cookie, env.cookieName);

    if (!rawToken) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    const session = await SessionModel.findOne({
      tokenHash: hashSessionToken(rawToken),
    });

    if (!session || session.expiresAt.getTime() <= Date.now()) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    const admin = await AdminModel.findById(session.adminId).select('_id email');
    if (!admin) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    request.authenticatedAdmin = {
      id: admin._id.toString(),
      email: admin.email,
    };
    next();
  } catch (error: unknown) {
    next(error);
  }
};

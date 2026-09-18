import { createHmac, randomBytes } from 'node:crypto';
import { env } from '../config/env.js';

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function createSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHmac('sha256', env.sessionSecret).update(token).digest('hex');
}

export function getCookieValue(cookieHeader: string | undefined, cookieName: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const name = part.slice(0, separatorIndex).trim();
    if (name === cookieName) {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim());
    }
  }

  return undefined;
}

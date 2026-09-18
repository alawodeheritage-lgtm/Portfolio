import type { Admin } from '../models/Admin.js';

declare global {
  namespace Express {
    interface Request {
      authenticatedAdmin?: Pick<Admin, 'email'> & { id: string };
    }
  }
}

export { };

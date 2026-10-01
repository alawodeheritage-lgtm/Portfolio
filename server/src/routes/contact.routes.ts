import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  archiveAdminMessage,
  deleteAdminMessage,
  listAdminMessages,
  markAdminMessageRead,
  markAdminMessageUnread,
  submitContactMessage,
  unarchiveAdminMessage,
} from '../controllers/contact.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateContactMessage, validateMessageId } from '../validators/contact.validators.js';

const contactSubmissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many contact submissions. Please try again later.' },
});

export const contactRouter = Router();
export const adminMessageRouter = Router();

contactRouter.post('/', contactSubmissionRateLimit, validateContactMessage, submitContactMessage);

adminMessageRouter.use(requireAuth);
adminMessageRouter.get('/', listAdminMessages);
adminMessageRouter.patch('/:id/read', validateMessageId, markAdminMessageRead);
adminMessageRouter.patch('/:id/unread', validateMessageId, markAdminMessageUnread);
adminMessageRouter.patch('/:id/archive', validateMessageId, archiveAdminMessage);
adminMessageRouter.patch('/:id/unarchive', validateMessageId, unarchiveAdminMessage);
adminMessageRouter.delete('/:id', validateMessageId, deleteAdminMessage);

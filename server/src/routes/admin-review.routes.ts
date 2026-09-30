import { Router } from 'express';
import {
  approveAdminReview,
  deleteAdminReview,
  listAdminReviews,
  rejectAdminReview,
} from '../controllers/admin-review.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateReviewId } from '../validators/review.validators.js';

export const adminReviewRouter = Router();

adminReviewRouter.use(requireAuth);
adminReviewRouter.get('/', listAdminReviews);
adminReviewRouter.patch('/:id/approve', validateReviewId, approveAdminReview);
adminReviewRouter.patch('/:id/reject', validateReviewId, rejectAdminReview);
adminReviewRouter.delete('/:id', validateReviewId, deleteAdminReview);

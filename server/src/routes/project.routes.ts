import { Router } from 'express';
import {
  getPublishedProjectBySlug,
  listFeaturedProjects,
  listPublishedProjects,
} from '../controllers/project.controller.js';
import rateLimit from 'express-rate-limit';
import {
  listApprovedProjectReviews,
  submitProjectReview,
} from '../controllers/review.controller.js';
import { validatePublicReview } from '../validators/review.validators.js';
import { validateProjectSlug } from '../validators/project.validators.js';

const reviewSubmissionRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many review submissions. Please try again later.' },
});

export const projectRouter = Router();

projectRouter.get('/', listPublishedProjects);
projectRouter.get('/featured', listFeaturedProjects);
projectRouter.get('/:slug/reviews', validateProjectSlug, listApprovedProjectReviews);
projectRouter.post(
  '/:slug/reviews',
  validateProjectSlug,
  reviewSubmissionRateLimit,
  validatePublicReview,
  submitProjectReview,
);
projectRouter.get('/:slug', validateProjectSlug, getPublishedProjectBySlug);

import { Router } from 'express';
import {
  getPublishedProjectBySlug,
  listFeaturedProjects,
  listPublishedProjects,
} from '../controllers/project.controller.js';
import { validateProjectSlug } from '../validators/project.validators.js';

export const projectRouter = Router();

projectRouter.get('/', listPublishedProjects);
projectRouter.get('/featured', listFeaturedProjects);
projectRouter.get('/:slug', validateProjectSlug, getPublishedProjectBySlug);

import { Router } from 'express';
import {
  createAdminProject,
  deleteAdminProject,
  listAdminProjects,
  setProjectFeatured,
  setProjectPublished,
  updateAdminProject,
} from '../controllers/admin-project.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  validateCreateProject,
  validateProjectId,
  validateProjectState,
  validateUpdateProject,
} from '../validators/admin-project.validators.js';

export const adminProjectRouter = Router();

adminProjectRouter.use(requireAuth);
adminProjectRouter.get('/', listAdminProjects);
adminProjectRouter.post('/', validateCreateProject, createAdminProject);
adminProjectRouter.patch('/:id', validateProjectId, validateUpdateProject, updateAdminProject);
adminProjectRouter.delete('/:id', validateProjectId, deleteAdminProject);
adminProjectRouter.patch('/:id/publish', validateProjectId, validateProjectState, setProjectPublished);
adminProjectRouter.patch('/:id/featured', validateProjectId, validateProjectState, setProjectFeatured);

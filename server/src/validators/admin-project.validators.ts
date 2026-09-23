import type { RequestHandler } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/httpError.js';

const slug = Joi.string()
  .trim()
  .lowercase()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const textArray = Joi.array().items(Joi.string().trim().min(1).max(500));
const mediaArray = Joi.array().items(Joi.string().trim().min(1).max(2000));
const httpUrl = Joi.string().trim().uri({ scheme: ['http', 'https'] }).allow('');
const boolean = Joi.boolean().strict();

const projectFields = {
  slug,
  title: Joi.string().trim().min(1).max(200),
  tagline: Joi.string().trim().max(300).allow(''),
  category: Joi.string().trim().max(120).allow(''),
  description: Joi.string().trim().min(1).max(10000),
  technologies: textArray,
  highlights: textArray,
  media: mediaArray,
  githubUrl: httpUrl,
  liveUrl: httpUrl,
  caseStudyUrl: httpUrl,
  caseStudyContent: Joi.string().trim().max(100000).allow(''),
  isPublished: boolean,
  isFeatured: boolean,
};

const createProjectSchema = Joi.object({
  ...projectFields,
  slug: slug.required(),
  title: projectFields.title.required(),
  description: projectFields.description.required(),
}).required();

const updateProjectSchema = Joi.object(projectFields).min(1).required();
const projectStateSchema = Joi.object({ value: boolean.required() }).required();
const projectIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).required();

function validateBody(schema: Joi.ObjectSchema, message: string): RequestHandler {
  return (request, _response, next) => {
    const { error, value } = schema.validate(request.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      next(new HttpError(400, message, error.details.map((detail) => detail.message)));
      return;
    }

    request.body = value;
    next();
  };
}

export const validateCreateProject = validateBody(
  createProjectSchema,
  'Invalid project data',
);

export const validateUpdateProject = validateBody(
  updateProjectSchema,
  'Invalid project update',
);

export const validateProjectState = validateBody(
  projectStateSchema,
  'Invalid project state',
);

export const validateProjectId: RequestHandler = (request, _response, next) => {
  const { error } = projectIdSchema.validate(request.params, { abortEarly: false });

  if (error) {
    next(new HttpError(400, 'Invalid project id'));
    return;
  }

  next();
};

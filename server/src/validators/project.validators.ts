import type { RequestHandler } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/httpError.js';

const slugSchema = Joi.object({
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
}).required();

export const validateProjectSlug: RequestHandler = (request, _response, next) => {
  const { error, value } = slugSchema.validate(request.params, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    next(new HttpError(400, 'Invalid project slug', error.details.map((detail) => detail.message)));
    return;
  }

  request.params.slug = value.slug;
  next();
};

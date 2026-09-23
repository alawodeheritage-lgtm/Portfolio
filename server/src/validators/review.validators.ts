import type { RequestHandler } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/httpError.js';

const reviewBodySchema = Joi.object({
  reviewerName: Joi.string().trim().min(2).max(120).required(),
  reviewerRole: Joi.string().trim().min(2).max(120).allow(''),
  rating: Joi.number().integer().min(1).max(5).strict().required(),
  comment: Joi.string().trim().min(10).max(5000).required(),
}).required();

export const validatePublicReview: RequestHandler = (request, _response, next) => {
  const { error, value } = reviewBodySchema.validate(request.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    next(new HttpError(400, 'Invalid review submission', error.details.map((detail) => detail.message)));
    return;
  }

  request.body = value;
  next();
};

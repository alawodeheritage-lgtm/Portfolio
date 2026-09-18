import Joi from 'joi';
import type { RequestHandler } from 'express';
import { HttpError } from '../utils/httpError.js';

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(128).required(),
}).required();

export const validateLogin: RequestHandler = (request, _response, next) => {
  const { error, value } = loginSchema.validate(request.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    next(new HttpError(400, 'Invalid login request', error.details.map((detail) => detail.message)));
    return;
  }

  request.body = value;
  next();
};

import type { RequestHandler } from 'express';
import Joi from 'joi';
import { HttpError } from '../utils/httpError.js';

const contactMessageSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().max(254).required(),
  message: Joi.string().trim().min(10).max(5000).required(),
}).required();

const messageIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).required();

const replyMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(5000).required(),
}).required();

export const validateContactMessage: RequestHandler = (request, _response, next) => {
  const { error, value } = contactMessageSchema.validate(request.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    next(new HttpError(400, 'Invalid contact message', error.details.map((detail) => detail.message)));
    return;
  }

  request.body = value;
  next();
};

export const validateMessageId: RequestHandler = (request, _response, next) => {
  const { error } = messageIdSchema.validate(request.params, { abortEarly: false });

  if (error) {
    next(new HttpError(400, 'Invalid message id'));
    return;
  }

  next();
};

export const validateReplyMessage: RequestHandler = (request, _response, next) => {
  const { error, value } = replyMessageSchema.validate(request.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    next(new HttpError(400, 'Invalid reply message', error.details.map((detail) => detail.message)));
    return;
  }

  request.body = value;
  next();
};

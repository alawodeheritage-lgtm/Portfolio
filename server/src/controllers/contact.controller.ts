import type { RequestHandler } from 'express';
import { ContactMessageModel, type ContactMessageDocument } from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

function toAdminMessage(message: ContactMessageDocument) {
  const id = message._id.toString();

  return {
    id,
    name: message.name,
    email: message.email,
    senderName: message.name,
    senderEmail: message.email,
    message: message.message,
    receivedAt: message.createdAt,
    isRead: message.isRead,
    isArchived: message.isArchived,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

export const submitContactMessage: RequestHandler = asyncHandler(async (request, response) => {
  const message = await ContactMessageModel.create({
    name: request.body.name,
    email: request.body.email,
    message: request.body.message,
  });

  response.status(201).json({
    message: 'Contact message received successfully',
    submission: { id: message._id.toString() },
  });
});

export const listAdminMessages: RequestHandler = asyncHandler(async (_request, response) => {
  const messages = await ContactMessageModel.find()
    .select('_id name email message isRead isArchived createdAt updatedAt')
    .sort({ createdAt: -1 })
    .exec();

  response.status(200).json({ messages: messages.map(toAdminMessage) });
});

async function setMessageFlag(
  id: string,
  field: 'isRead' | 'isArchived',
  value: boolean,
): Promise<ContactMessageDocument> {
  const message = await ContactMessageModel.findByIdAndUpdate(
    id,
    { $set: { [field]: value } },
    { new: true, runValidators: true },
  ).exec();

  if (!message) {
    throw new HttpError(404, 'Contact message not found');
  }

  return message;
}

export const markAdminMessageRead: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const message = await setMessageFlag(id, 'isRead', true);
  response.status(200).json({ message: toAdminMessage(message) });
});

export const markAdminMessageUnread: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const message = await setMessageFlag(id, 'isRead', false);
  response.status(200).json({ message: toAdminMessage(message) });
});

export const archiveAdminMessage: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const message = await setMessageFlag(id, 'isArchived', true);
  response.status(200).json({ message: toAdminMessage(message) });
});

export const unarchiveAdminMessage: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const message = await setMessageFlag(id, 'isArchived', false);
  response.status(200).json({ message: toAdminMessage(message) });
});

export const deleteAdminMessage: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const deletedMessage = await ContactMessageModel.findByIdAndDelete(id).exec();

  if (!deletedMessage) {
    throw new HttpError(404, 'Contact message not found');
  }

  response.status(200).json({ message: 'Contact message deleted successfully' });
});

import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { ContactMessageModel, type ContactMessageDocument } from '../models/ContactMessage.js';
import { sendTransactionalEmail } from '../services/brevo.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const portfolioName = 'Developer Portfolio & Platform';

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

export const replyToAdminMessage: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const message = await ContactMessageModel.findById(id).exec();

  if (!message) {
    throw new HttpError(404, 'Contact message not found');
  }

  const replyText = typeof request.body.message === 'string' ? request.body.message.trim() : '';

  if (!replyText) {
    throw new HttpError(400, 'Reply message is required');
  }

  const visitorName = message.name?.trim() || 'there';
  const plainTextReply = [
    `Hello ${visitorName},`,
    '',
    `Thank you for contacting ${portfolioName}. Here is a reply from the team:`,
    '',
    replyText,
    '',
    'Best regards,',
    portfolioName,
  ].join('\n');

  const safeHtmlReply = replyText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '<br />');

  const htmlReply = [
    '<p>Hello ' + visitorName + ',</p>',
    '<p>Thank you for contacting ' + portfolioName + '. Here is a reply from the team:</p>',
    '<p>' + safeHtmlReply + '</p>',
    '<p>Best regards,<br />' + portfolioName + '</p>',
  ].join('');

  try {
    await sendTransactionalEmail({
      to: [{ email: message.email, name: message.name }],
      subject: `Re: Your message to ${portfolioName}`,
      textContent: plainTextReply,
      htmlContent: htmlReply,
      replyTo: {
        email: env.emailFromAddress,
        name: env.emailFromName,
      },
    });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : 'Unknown Brevo error';
    console.error('Brevo reply email failed:', details);
    throw new HttpError(502, 'Failed to send reply email');
  }

  response.status(200).json({
    message: 'Reply sent successfully',
    reply: { id: message._id.toString() },
  });
});

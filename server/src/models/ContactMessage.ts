import { Document, Model, Schema, model } from 'mongoose';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageDocument = ContactMessage & Document;

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

contactMessageSchema.index({ isArchived: 1, isRead: 1, createdAt: -1 });

export const ContactMessageModel: Model<ContactMessageDocument> = model<ContactMessageDocument>(
  'ContactMessage',
  contactMessageSchema,
);

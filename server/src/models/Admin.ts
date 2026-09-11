import { Document, Model, Schema, model } from 'mongoose';

export interface Admin {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminDocument = Admin & Document;

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

export const AdminModel: Model<AdminDocument> = model<AdminDocument>('Admin', adminSchema);

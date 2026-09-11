import { Document, Model, Schema, Types, model } from 'mongoose';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  projectId: Types.ObjectId;
  reviewerName: string;
  reviewerRole?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewDocument = Review & Document;

const reviewSchema = new Schema<ReviewDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    reviewerName: { type: String, required: true, trim: true },
    reviewerRole: { type: String, trim: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ projectId: 1, status: 1 });

export const ReviewModel: Model<ReviewDocument> = model<ReviewDocument>('Review', reviewSchema);

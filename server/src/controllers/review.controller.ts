import type { RequestHandler } from 'express';
import { ProjectModel } from '../models/Project.js';
import { ReviewModel } from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const publicReviewFields = '_id reviewerName reviewerRole rating comment createdAt updatedAt';

function toPublicReview(review: {
  _id: { toString(): string };
  reviewerName: string;
  reviewerRole?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: review._id.toString(),
    reviewerName: review.reviewerName,
    reviewerRole: review.reviewerRole,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

async function findPublishedProject(slug: string) {
  const project = await ProjectModel.findOne({ slug, isPublished: true }).select('_id').exec();

  if (!project) {
    throw new HttpError(404, 'Project not found');
  }

  return project;
}

export const listApprovedProjectReviews: RequestHandler = asyncHandler(async (request, response) => {
  const slug = Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
  const project = await findPublishedProject(slug);
  const reviews = await ReviewModel.find({ projectId: project._id, status: 'approved' })
    .select(publicReviewFields)
    .sort({ createdAt: -1 })
    .exec();

  response.status(200).json({ reviews: reviews.map(toPublicReview) });
});

export const submitProjectReview: RequestHandler = asyncHandler(async (request, response) => {
  const slug = Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
  const project = await findPublishedProject(slug);
  const review = await ReviewModel.create({
    projectId: project._id,
    reviewerName: request.body.reviewerName,
    reviewerRole: request.body.reviewerRole,
    rating: request.body.rating,
    comment: request.body.comment,
    status: 'pending',
  });

  response.status(201).json({
    message: 'Review submitted for approval',
    review: {
      id: review._id.toString(),
      status: review.status,
    },
  });
});

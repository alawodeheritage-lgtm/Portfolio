import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { ReviewModel, type ReviewDocument, type ReviewStatus } from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

type ReviewWithProject = ReviewDocument & {
  projectId: {
    _id: Types.ObjectId;
    title: string;
    slug: string;
    category?: string;
  } | null;
};

function toAdminReview(review: ReviewWithProject) {
  return {
    id: review._id.toString(),
    reviewerName: review.reviewerName,
    reviewerRole: review.reviewerRole,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    project: review.projectId
      ? {
        id: review.projectId._id.toString(),
        title: review.projectId.title,
        slug: review.projectId.slug,
        category: review.projectId.category,
      }
      : null,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

const reviewSelection = '_id projectId reviewerName reviewerRole rating comment status createdAt updatedAt';
const projectPopulation = {
  path: 'projectId',
  select: 'title slug category',
};

export const listAdminReviews: RequestHandler = asyncHandler(async (_request, response) => {
  const reviews = await ReviewModel.find()
    .select(reviewSelection)
    .populate<Pick<ReviewWithProject, 'projectId'>>(projectPopulation)
    .sort({ createdAt: -1 })
    .exec();

  response.status(200).json({ reviews: reviews.map(toAdminReview) });
});

async function updateReviewStatus(id: string, status: ReviewStatus): Promise<ReviewWithProject> {
  const review = await ReviewModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  )
    .select(reviewSelection)
    .populate<Pick<ReviewWithProject, 'projectId'>>(projectPopulation)
    .exec();

  if (!review) {
    throw new HttpError(404, 'Review not found');
  }

  return review;
}

export const approveAdminReview: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const review = await updateReviewStatus(id, 'approved');
  response.status(200).json({ review: toAdminReview(review) });
});

export const rejectAdminReview: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const review = await updateReviewStatus(id, 'rejected');
  response.status(200).json({ review: toAdminReview(review) });
});

export const deleteAdminReview: RequestHandler = asyncHandler(async (request, response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const review = await ReviewModel.findByIdAndDelete(id).exec();

  if (!review) {
    throw new HttpError(404, 'Review not found');
  }

  response.status(200).json({ message: 'Review deleted successfully' });
});

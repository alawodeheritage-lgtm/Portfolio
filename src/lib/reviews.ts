const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface PublicProjectReview {
  id: string;
  reviewerName: string;
  reviewerRole?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitProjectReviewPayload {
  reviewerName: string;
  reviewerRole?: string;
  rating: number;
  comment: string;
}

export interface SubmitProjectReviewResponse {
  message: string;
  review: {
    id: string;
    status: 'pending';
  };
}

export interface ReviewProjectSummary {
  id: string;
  title: string;
  slug: string;
  category?: string;
}

export interface AdminReviewItem {
  id: string;
  reviewerName: string;
  reviewerRole?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  project: ReviewProjectSummary | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminReviewApiItem = AdminReviewItem;

interface PublicReviewsResponse {
  reviews: PublicProjectReview[];
}

interface AdminReviewsResponse {
  reviews: AdminReviewItem[];
}

interface AdminReviewResponse {
  review: AdminReviewItem;
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; details?: string[] };
    if (body.details && Array.isArray(body.details) && body.details.length > 0) {
      return `${body.error || fallback}: ${body.details.join('; ')}`;
    }
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readError(response, 'Review request failed.'));
  }

  return (await response.json()) as T;
}

/**
 * Public: Fetch approved reviews for a published project by slug.
 */
export async function fetchProjectReviews(slug: string): Promise<PublicProjectReview[]> {
  const response = await request<PublicReviewsResponse>(
    `/api/projects/${encodeURIComponent(slug)}/reviews`,
  );
  return response.reviews;
}

/**
 * Public: Submit a new review for a published project by slug.
 * The submitted review is saved in 'pending' status awaiting admin moderation.
 */
export async function submitProjectReview(
  slug: string,
  payload: SubmitProjectReviewPayload,
): Promise<SubmitProjectReviewResponse> {
  return request<SubmitProjectReviewResponse>(
    `/api/projects/${encodeURIComponent(slug)}/reviews`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

/**
 * Admin: Fetch all reviews across projects with moderation status and project details.
 */
export async function fetchAdminReviews(): Promise<AdminReviewItem[]> {
  const response = await request<AdminReviewsResponse>('/api/admin/reviews');
  return response.reviews;
}

/**
 * Admin: Approve a pending or rejected review submission.
 */
export async function approveAdminReview(id: string): Promise<AdminReviewItem> {
  const response = await request<AdminReviewResponse>(
    `/api/admin/reviews/${encodeURIComponent(id)}/approve`,
    {
      method: 'PATCH',
    },
  );
  return response.review;
}

/**
 * Admin: Reject a pending or approved review submission.
 */
export async function rejectAdminReview(id: string): Promise<AdminReviewItem> {
  const response = await request<AdminReviewResponse>(
    `/api/admin/reviews/${encodeURIComponent(id)}/reject`,
    {
      method: 'PATCH',
    },
  );
  return response.review;
}

/**
 * Admin: Permanently delete a review submission.
 */
export async function deleteAdminReview(id: string): Promise<void> {
  await request<{ message: string }>(
    `/api/admin/reviews/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    },
  );
}

import 'dotenv/config';

const baseUrl = 'http://localhost:4000';
const slug = 'p';
const createdReviewIds = [];
let sessionCookie = '';

async function request(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(sessionCookie ? { Cookie: sessionCookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : {} };
}

try {
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  sessionCookie = loginResponse.headers.get('set-cookie')?.split(';', 1)[0] ?? '';
  console.log(`login_status=${loginResponse.status}`);
  if (!loginResponse.ok || !sessionCookie) throw new Error('Admin login did not issue a session cookie');

  const project = await request('GET', `/api/projects/${slug}/reviews`);
  console.log(`published_project_reviews_status=${project.status}`);
  if (project.status !== 200) throw new Error('Published project review endpoint unavailable');

  const first = await request('POST', `/api/projects/${slug}/reviews`, {
    reviewerName: 'API Verification Visitor',
    reviewerRole: 'Portfolio reviewer',
    rating: 5,
    comment: 'This review verifies the moderation flow end to end.',
  });
  const firstId = first.body.review?.id;
  if (firstId) createdReviewIds.push(firstId);
  console.log(`first_post_status=${first.status} pending=${first.body.review?.status === 'pending'}`);
  if (first.status !== 201 || !firstId || first.body.review.status !== 'pending') {
    throw new Error('First review was not created as pending');
  }

  let adminList = await request('GET', '/api/admin/reviews');
  let storedFirst = adminList.body.reviews?.find((review) => review.id === firstId);
  console.log(`first_review_mongodb_pending=${storedFirst?.status === 'pending'}`);
  if (storedFirst?.status !== 'pending') throw new Error('First review pending state not confirmed');

  const approval = await request('PATCH', `/api/admin/reviews/${firstId}/approve`);
  const visibleReviews = await request('GET', `/api/projects/${slug}/reviews`);
  console.log(`approve_status=${approval.status} approved_review_public=${visibleReviews.body.reviews?.some((review) => review.id === firstId)}`);
  if (approval.status !== 200 || !visibleReviews.body.reviews?.some((review) => review.id === firstId)) {
    throw new Error('Approved review did not become publicly visible');
  }

  const second = await request('POST', `/api/projects/${slug}/reviews`, {
    reviewerName: 'Second API Reviewer',
    reviewerRole: 'Visitor',
    rating: 4,
    comment: 'This second review verifies rejected review visibility.',
  });
  const secondId = second.body.review?.id;
  if (secondId) createdReviewIds.push(secondId);
  if (second.status !== 201 || !secondId) throw new Error('Second review was not created');

  const rejection = await request('PATCH', `/api/admin/reviews/${secondId}/reject`);
  adminList = await request('GET', '/api/admin/reviews');
  const storedSecond = adminList.body.reviews?.find((review) => review.id === secondId);
  const publicAfterReject = await request('GET', `/api/projects/${slug}/reviews`);
  console.log(`reject_status=${rejection.status} rejected_review_mongodb=${storedSecond?.status === 'rejected'} rejected_review_public=${publicAfterReject.body.reviews?.some((review) => review.id === secondId) ?? false}`);
  if (rejection.status !== 200 || storedSecond?.status !== 'rejected' || publicAfterReject.body.reviews?.some((review) => review.id === secondId)) {
    throw new Error('Rejected review state/visibility verification failed');
  }
} catch (error) {
  console.log(`verification_issue=${error instanceof Error ? error.message : 'Unknown error'}`);
  process.exitCode = 1;
} finally {
  for (const id of createdReviewIds) {
    try {
      const deleted = await request('DELETE', `/api/admin/reviews/${id}`);
      console.log(`cleanup_delete_${id}=${deleted.status}`);
    } catch {
      console.log('cleanup_delete_failed');
    }
  }
}

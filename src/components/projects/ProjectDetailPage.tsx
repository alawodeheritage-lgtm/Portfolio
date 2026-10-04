import React, { useEffect, useState } from 'react';
import { AdminProjectApiProject, fetchPublicProjectBySlug } from '../../lib/projects';
import { fetchProjectReviews, PublicProjectReview, submitProjectReview } from '../../lib/reviews';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { Icon } from '../ui/Icon';
import { BrandLoader } from '../ui/BrandLoader';

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onNavigate }) => {
  const [project, setProject] = useState<AdminProjectApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PublicProjectReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    setProject(null);

    fetchPublicProjectBySlug(slug)
      .then((result) => {
        if (active) setProject(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load this project.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setIsLoadingReviews(true);
    setReviewsError(null);
    setReviews([]);

    fetchProjectReviews(slug)
      .then((approvedReviews) => {
        if (active) setReviews(approvedReviews);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setReviewsError(requestError instanceof Error ? requestError.message : 'Unable to load reviews.');
        }
      })
      .finally(() => {
        if (active) setIsLoadingReviews(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating < 1 || rating > 5) {
      setSubmissionError('Choose a rating from 1 to 5 stars.');
      return;
    }

    setIsSubmittingReview(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      await submitProjectReview(slug, {
        reviewerName: reviewerName.trim(),
        reviewerRole: reviewerRole.trim() || undefined,
        rating,
        comment: comment.trim(),
      });
      setReviewerName('');
      setReviewerRole('');
      setRating(0);
      setComment('');
      setSubmissionSuccess('Your review was submitted and is awaiting approval.');
    } catch (requestError) {
      setSubmissionError(requestError instanceof Error ? requestError.message : 'Unable to submit your review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const externalCaseStudyUrl =
    project?.caseStudyUrl && project.caseStudyUrl !== `/projects/${project.slug}`
      ? project.caseStudyUrl
      : undefined;

  return (
    <article className="py-12 sm:py-20 bg-[#FAFAF9] flex-1 text-stone-900">
      <Container size="narrow">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => onNavigate('/projects')}
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-950"
          >
            <Icon name="arrow_back" size="sm" />
            All projects
          </button>

          {isLoading ? (
            <BrandLoader label="Loading project..." size="sm" className="mt-8 text-sm text-stone-600" />
          ) : error || !project ? (
            <div className="mt-8 p-6 bg-white border border-stone-200 rounded-xl" role="alert">
              <h1 className="text-xl font-bold font-display text-stone-900">Project unavailable</h1>
              <p className="mt-2 text-sm text-stone-600">{error || 'This project could not be found.'}</p>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              <header className="pb-8 border-b border-stone-200">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase text-stone-500">
                  {project.category && <span>{project.category}</span>}
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-amber-800">
                      <Icon name="star" size="sm" /> Featured
                    </span>
                  )}
                </div>
                <h1 className="mt-3 text-3xl sm:text-5xl font-bold font-display tracking-tight text-stone-950">
                  {project.title}
                </h1>
                {project.tagline && <p className="mt-3 text-lg text-stone-600">{project.tagline}</p>}
                <p className="mt-6 text-base sm:text-lg text-stone-700 leading-relaxed">{project.description}</p>

                <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                  {project.caseStudyContent ? (
                    <a href="#project-case-study" className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
                      Read case study <Icon name="arrow_downward" size="sm" />
                    </a>
                  ) : externalCaseStudyUrl ? (
                    <a href={externalCaseStudyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
                      Read case study <Icon name="open_in_new" size="sm" />
                    </a>
                  ) : project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
                      View live project <Icon name="open_in_new" size="sm" />
                    </a>
                  ) : null}
                  {project.liveUrl && (project.caseStudyContent || externalCaseStudyUrl) && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-stone-800 text-sm hover:bg-stone-100">
                      View live project <Icon name="open_in_new" size="sm" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-stone-800 text-sm hover:bg-stone-100">
                      View source <Icon name="code" size="sm" />
                    </a>
                  )}
                </div>
              </header>

              {project.media.length > 0 && (
                <section aria-label="Project images" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.media.map((imageUrl, index) => (
                    <img
                      key={`${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`${project.title} project image ${index + 1}`}
                      loading="lazy"
                      className="w-full h-auto max-h-[28rem] object-cover rounded-xl border border-stone-200 bg-white"
                    />
                  ))}
                </section>
              )}

              {project.technologies.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span key={technology} className="px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-mono text-stone-800">
                        {technology}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {project.highlights.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">Highlights</h2>
                  <ul className="space-y-2 text-sm text-stone-700">
                    {project.highlights.map((highlight, index) => (
                      <li key={`${highlight}-${index}`} className="flex items-start gap-2">
                        <Icon name="check" size="sm" className="mt-0.5 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.caseStudyContent && (
                <section id="project-case-study" className="space-y-3 border-t border-stone-200 pt-8 scroll-mt-24">
                  <h2 className="text-xl font-bold font-display text-stone-900">Case study</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{project.caseStudyContent}</div>
                </section>
              )}

              <section className="border-t border-stone-200 pt-8 space-y-8" aria-labelledby="project-reviews-heading">
                <div className="space-y-4">
                  <div>
                    <h2 id="project-reviews-heading" className="text-2xl font-bold font-display text-stone-900">Reviews</h2>
                    <p className="mt-1 text-sm text-stone-600">Approved feedback from project visitors.</p>
                  </div>

                  {isLoadingReviews ? (
                    <BrandLoader label="Loading reviews..." size="sm" className="text-sm text-stone-600" />
                  ) : reviewsError ? (
                    <p className="text-sm text-rose-700" role="alert">{reviewsError}</p>
                  ) : reviews.length === 0 ? (
                    <p className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-sm text-stone-600">
                      No approved reviews yet. Be the first to share feedback.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {reviews.map((review) => (
                        <li key={review.id} className="p-5 bg-white border border-stone-200 rounded-xl space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-stone-900">{review.reviewerName}</h3>
                              {review.reviewerRole && <p className="mt-0.5 text-sm text-stone-500">{review.reviewerRole}</p>}
                            </div>
                            <span className="text-amber-600 tracking-wide" role="img" aria-label={`${review.rating} out of 5 stars`}>
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border-t border-stone-200 pt-7 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-display text-stone-900">Leave a Review</h3>
                    <p className="mt-1 text-sm text-stone-600">Reviews are shown publicly after approval.</p>
                  </div>

                  {submissionSuccess && (
                    <p className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800" role="status">
                      {submissionSuccess}
                    </p>
                  )}
                  {submissionError && (
                    <p className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800" role="alert">
                      {submissionError}
                    </p>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="space-y-1.5 text-sm font-medium text-stone-800">
                        <span>Your name *</span>
                        <input
                          type="text"
                          required
                          minLength={2}
                          maxLength={120}
                          value={reviewerName}
                          onChange={(event) => setReviewerName(event.target.value)}
                          disabled={isSubmittingReview}
                          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-60"
                        />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium text-stone-800">
                        <span>Role (optional)</span>
                        <input
                          type="text"
                          minLength={2}
                          maxLength={120}
                          value={reviewerRole}
                          onChange={(event) => setReviewerRole(event.target.value)}
                          disabled={isSubmittingReview}
                          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-60"
                        />
                      </label>
                    </div>

                    <fieldset className="space-y-2" aria-required="true">
                      <legend className="text-sm font-medium text-stone-800">Rating *</legend>
                      <div className="flex items-center gap-1" role="group" aria-label="Choose a rating from 1 to 5">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            aria-label={`${value} star${value === 1 ? '' : 's'}`}
                            aria-pressed={rating === value}
                            disabled={isSubmittingReview}
                            onClick={() => setRating(value)}
                            className={`p-1 text-2xl leading-none disabled:opacity-60 ${value <= rating ? 'text-amber-500' : 'text-stone-300'}`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-xs text-stone-500">{rating ? `${rating} of 5` : 'Choose a rating'}</span>
                      </div>
                    </fieldset>

                    <label className="block space-y-1.5 text-sm font-medium text-stone-800">
                      <span>Comment *</span>
                      <textarea
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={5}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        disabled={isSubmittingReview}
                        className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:opacity-60"
                      />
                    </label>

                    <Button type="submit" variant="primary" size="md" disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </div>
              </section>

            </div>
          )}
        </div>
      </Container>
    </article>
  );
};

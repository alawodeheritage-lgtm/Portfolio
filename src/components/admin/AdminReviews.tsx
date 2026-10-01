import React, { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import {
  AdminReviewItem,
  approveAdminReview,
  deleteAdminReview,
  fetchAdminReviews,
  rejectAdminReview,
} from '../../lib/reviews';

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');

  // Tracks the id of the review currently being mutated to prevent double-clicks.
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  // Inline error feedback per action (separate from load error).
  const [actionError, setActionError] = useState<string | null>(null);

  // ─── Load reviews from MongoDB on mount ────────────────────────────────────
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    fetchAdminReviews()
      .then((data) => {
        if (active) setReviews(data);
      })
      .catch((err: unknown) => {
        if (active)
          setLoadError(
            err instanceof Error ? err.message : 'Unable to load reviews.',
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const replaceReview = (updated: AdminReviewItem) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
  };

  const removeReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const clearActionError = () => setActionError(null);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const handleApprove = async (id: string) => {
    setMutatingId(id);
    clearActionError();
    try {
      const updated = await approveAdminReview(id);
      replaceReview(updated);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to approve review.',
      );
    } finally {
      setMutatingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setMutatingId(id);
    clearActionError();
    try {
      const updated = await rejectAdminReview(id);
      replaceReview(updated);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to reject review.',
      );
    } finally {
      setMutatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this review submission?')) return;
    setMutatingId(id);
    clearActionError();
    try {
      await deleteAdminReview(id);
      removeReview(id);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to delete review.',
      );
    } finally {
      setMutatingId(null);
    }
  };

  // ─── Derived state ─────────────────────────────────────────────────────────
  const filteredReviews = reviews.filter((r) => {
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const countByStatus = (status: AdminReviewItem['status']) =>
    reviews.filter((r) => r.status === status).length;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto" id="admin-reviews-root">
        <div className="p-10 text-center bg-white rounded-xl border border-stone-200 text-stone-500 font-mono text-xs">
          <span className="inline-block animate-spin h-4 w-4 border-2 border-stone-400 border-t-transparent rounded-full mr-2 align-middle" />
          Loading reviews from database…
        </div>
      </div>
    );
  }

  // ─── Load error state ──────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto" id="admin-reviews-root">
        <div className="p-8 bg-white rounded-xl border border-rose-200 text-rose-700 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-rose-800">
            <Icon name="error" size="sm" />
            <span>Failed to load reviews</span>
          </div>
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="admin-reviews-root">
      {/* Action error banner */}
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-mono flex items-center justify-between gap-3">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={clearActionError}
            className="text-rose-500 hover:text-rose-800"
            aria-label="Dismiss error"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>
      )}

      {/* Moderation Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-1 text-xs font-mono flex-wrap">
          {(
            [
              { key: 'all', label: `All Submissions (${reviews.length})` },
              { key: 'approved', label: `Approved (${countByStatus('approved')})` },
              { key: 'pending', label: `Pending Queue (${countByStatus('pending')})` },
              { key: 'rejected', label: `Rejected (${countByStatus('rejected')})` },
            ] as { key: FilterTab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === key
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-stone-400">
          Reviews enter via the public submission form.
        </div>
      </div>

      {/* Review Card List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 font-mono text-xs">
            {filter === 'all'
              ? 'No review submissions in the database yet. Visitors can submit reviews through the public project pages.'
              : `No ${filter} reviews match the selected filter.`}
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isMutating = mutatingId === r.id;

            return (
              <div
                key={r.id}
                className={`bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4 transition-opacity ${
                  isMutating ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-base font-display">
                        {r.reviewerName}
                      </span>
                      {r.reviewerRole && (
                        <>
                          <span className="font-mono text-stone-400">•</span>
                          <span className="font-mono text-xs text-stone-600">
                            {r.reviewerRole}
                          </span>
                        </>
                      )}
                    </div>
                    {r.project && (
                      <div className="text-xs text-stone-500 font-mono flex items-center gap-2">
                        <Icon name="folder_open" size="sm" />
                        <span>{r.project.title}</span>
                        {r.project.category && (
                          <>
                            <span>•</span>
                            <span>{r.project.category}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Rating stars */}
                    <span className="font-mono text-xs text-amber-600 font-semibold tracking-wider">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                    {/* Status badge */}
                    <span
                      className={`font-mono text-xs px-2.5 py-0.5 rounded-full capitalize ${
                        r.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : r.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {r.status}
                    </span>
                    {/* Submission date */}
                    <span className="text-xs font-mono text-stone-400">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Review comment */}
                <blockquote className="text-sm text-stone-700 leading-relaxed font-serif italic">
                  &ldquo;{r.comment}&rdquo;
                </blockquote>

                {/* Action row */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {r.status !== 'approved' && (
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() => void handleApprove(r.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium flex items-center gap-1"
                      >
                        <Icon name="check" size="sm" />
                        <span>Approve</span>
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() => void handleReject(r.id)}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 flex items-center gap-1"
                      >
                        <Icon name="block" size="sm" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => void handleDelete(r.id)}
                    className="text-stone-400 hover:text-rose-600 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Icon name="delete" size="sm" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


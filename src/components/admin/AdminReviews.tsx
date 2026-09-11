import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { INITIAL_ADMIN_REVIEWS } from '../../data/adminMockData';
import { AdminReviewItem, ReviewStatus } from '../../types/admin';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReviewItem[]>(INITIAL_ADMIN_REVIEWS);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New review form
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [relationship, setRelationship] = useState<AdminReviewItem['relationship']>('colleague');
  const [content, setContent] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'pending') return r.status === 'pending';
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this review submission?')) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    const newEntry: AdminReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: authorName.trim(),
      authorRole: authorRole.trim() || 'Software Collaborator',
      organization: organization.trim() || 'Independent',
      relationship,
      content: content.trim(),
      status: 'approved',
      submittedAt: 'Today',
    };

    setReviews([newEntry, ...reviews]);
    setShowAddForm(false);
    setAuthorName('');
    setAuthorRole('');
    setOrganization('');
    setContent('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="admin-reviews-root">
      {/* Moderation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Submissions ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Approved ({reviews.filter((r) => r.status === 'approved').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Pending Queue ({reviews.filter((r) => r.status === 'pending').length})
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon="add"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close Form' : 'Log New Review'}
        </Button>
      </div>

      {/* Manual Input Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold font-display text-stone-900">
              Record Colleague / Peer Endorsement
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Captures genuine feedback from project mentors and collaborators
            </p>
          </div>

          <form onSubmit={handleAddReview} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Author Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Samuel Olatunji"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Role / Position</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Lead Systems Engineer"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Organization / Context</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. BCOS or LAUTECH"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-800">Relationship Type</label>
              <select
                value={relationship}
                onChange={(e) =>
                  setRelationship(e.target.value as AdminReviewItem['relationship'])
                }
                className="w-full sm:w-64 px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
              >
                <option value="colleague">Colleague / Operational Peer</option>
                <option value="mentor">Supervisor / Mentor</option>
                <option value="peer">Academic Peer (LAUTECH)</option>
                <option value="client">Client / Stakeholder</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-800">Feedback / Notes</label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Direct feedback or endorsement regarding technical discipline, communication, or code quality..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 font-mono text-xs">
            No review records match the selected filter.
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-base font-display">
                      {r.authorName}
                    </span>
                    <span className="font-mono text-stone-400">•</span>
                    <span className="font-mono text-xs text-stone-600">
                      {r.authorRole}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 font-mono flex items-center gap-2">
                    <span>{r.organization}</span>
                    <span>•</span>
                    <span className="capitalize">{r.relationship}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs px-2.5 py-0.5 rounded-full capitalize ${
                      r.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    {r.submittedAt}
                  </span>
                </div>
              </div>

              <blockquote className="text-sm text-stone-700 leading-relaxed font-serif italic">
                &ldquo;{r.content}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {r.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(r.id, 'approved')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1"
                    >
                      <Icon name="check" size="sm" />
                      <span>Approve for Public Display</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(r.id, 'pending')}
                      className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                    >
                      Move to Pending
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="text-stone-400 hover:text-rose-600 flex items-center gap-1"
                >
                  <Icon name="delete" size="sm" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

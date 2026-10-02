import React, { useEffect, useState } from 'react';
import type { AdminMessageItem } from '../../types/admin';
import { fetchAdminMessages } from '../../lib/messages';
import { fetchAdminProjects, type AdminProjectApiProject } from '../../lib/projects';
import { fetchAdminReviews, type AdminReviewItem } from '../../lib/reviews';
import { Icon } from '../ui/Icon';

interface Metric {
  label: string;
  value: number | string;
  icon: string;
  description?: string;
}

interface MetricSectionProps {
  title: string;
  description: string;
  metrics: Metric[];
  isEmpty: boolean;
  emptyMessage: string;
}

const MetricSection: React.FC<MetricSectionProps> = ({
  title,
  description,
  metrics,
  isEmpty,
  emptyMessage,
}) => (
  <section className="space-y-4" aria-label={title}>
    <div>
      <h2 className="text-base font-bold font-display text-stone-900">{title}</h2>
      <p className="text-xs text-stone-500 font-mono">{description}</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>{metric.label}</span>
            <Icon name={metric.icon} size="sm" />
          </div>
          <div className="text-3xl font-bold font-display text-stone-950">
            {metric.value}
          </div>
          {metric.description && (
            <p className="text-xs text-stone-500 font-mono">{metric.description}</p>
          )}
        </div>
      ))}
    </div>

    {isEmpty && (
      <p className="text-xs text-stone-500 font-mono" role="status">
        {emptyMessage}
      </p>
    )}
  </section>
);

function formatRate(numerator: number, denominator: number): string {
  return denominator === 0 ? '—' : `${((numerator / denominator) * 100).toFixed(1)}%`;
}

export const AdminAnalytics: React.FC = () => {
  const [projects, setProjects] = useState<AdminProjectApiProject[]>([]);
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [messages, setMessages] = useState<AdminMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchAdminProjects(),
      fetchAdminReviews(),
      fetchAdminMessages(),
    ])
      .then(([fetchedProjects, fetchedReviews, fetchedMessages]) => {
        if (!active) return;
        setProjects(fetchedProjects);
        setReviews(fetchedReviews);
        setMessages(fetchedMessages);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : 'Unable to load admin analytics data.',
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const publishedProjects = projects.filter((project) => project.isPublished);
  const unpublishedProjects = projects.length - publishedProjects.length;
  const approvedReviews = reviews.filter((review) => review.status === 'approved');
  const pendingReviews = reviews.filter((review) => review.status === 'pending');
  const rejectedReviews = reviews.filter((review) => review.status === 'rejected');
  const readMessages = messages.filter((message) => message.isRead);
  const unreadMessages = messages.filter((message) => !message.isRead);
  const archivedMessages = messages.filter((message) => message.isArchived);

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto" id="admin-analytics-root">
        <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 font-mono text-xs">
          Loading analytics data from the database…
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto" id="admin-analytics-root">
        <div className="p-8 bg-white rounded-xl border border-rose-200 text-rose-700 font-mono text-xs">
          {loadError}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto" id="admin-analytics-root">
      <MetricSection
        title="Project Overview"
        description="Current project publication status from the catalog."
        isEmpty={projects.length === 0}
        emptyMessage="No project records are available."
        metrics={[
          { label: 'Total Projects', value: projects.length, icon: 'folder_open' },
          { label: 'Published Projects', value: publishedProjects.length, icon: 'check_circle' },
          { label: 'Unpublished Projects', value: unpublishedProjects, icon: 'pending' },
        ]}
      />

      <MetricSection
        title="Review Overview"
        description="Submission totals and moderation outcomes."
        isEmpty={reviews.length === 0}
        emptyMessage="No review records are available."
        metrics={[
          { label: 'Total Reviews', value: reviews.length, icon: 'rate_review' },
          { label: 'Pending Reviews', value: pendingReviews.length, icon: 'pending' },
          { label: 'Approved Reviews', value: approvedReviews.length, icon: 'check_circle' },
          { label: 'Rejected Reviews', value: rejectedReviews.length, icon: 'cancel' },
          {
            label: 'Review Approval Rate',
            value: formatRate(approvedReviews.length, reviews.length),
            icon: 'trending_up',
            description: 'Approved reviews out of all review submissions',
          },
        ]}
      />

      <MetricSection
        title="Message Overview"
        description="Contact submission volume and inbox status."
        isEmpty={messages.length === 0}
        emptyMessage="No message records are available."
        metrics={[
          { label: 'Total Messages', value: messages.length, icon: 'mail' },
          { label: 'Unread Messages', value: unreadMessages.length, icon: 'mark_email_unread' },
          { label: 'Read Messages', value: readMessages.length, icon: 'drafts' },
          { label: 'Archived Messages', value: archivedMessages.length, icon: 'archive' },
          {
            label: 'Message Read Rate',
            value: formatRate(readMessages.length, messages.length),
            icon: 'trending_up',
            description: 'Read messages out of all contact submissions',
          },
        ]}
      />
    </div>
  );
};

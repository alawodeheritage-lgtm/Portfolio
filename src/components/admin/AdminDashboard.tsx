import React from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import {
  INITIAL_ADMIN_PROJECTS,
  INITIAL_ADMIN_MESSAGES,
  INITIAL_ADMIN_REVIEWS,
  INITIAL_ADMIN_ANALYTICS,
} from '../../data/adminMockData';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const publishedProjects = INITIAL_ADMIN_PROJECTS.filter((p) => p.status === 'published');
  const unreadMessages = INITIAL_ADMIN_MESSAGES.filter((m) => !m.isRead);
  const pendingReviews = INITIAL_ADMIN_REVIEWS.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-8 max-w-7xl mx-auto" id="admin-dashboard-root">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-500">
              Published Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Icon name="folder_open" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-stone-950">
              {publishedProjects.length}
            </span>
            <span className="text-xs font-mono text-stone-500">
              of {INITIAL_ADMIN_PROJECTS.length} total
            </span>
          </div>
          <p className="text-xs text-stone-600">
            {INITIAL_ADMIN_PROJECTS.length - publishedProjects.length > 0
              ? `${INITIAL_ADMIN_PROJECTS.length - publishedProjects.length} draft in review`
              : 'All catalog projects published and active'}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-500">
              Total Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Icon name="mail" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-stone-950">
              {INITIAL_ADMIN_MESSAGES.length}
            </span>
            {unreadMessages.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                {unreadMessages.length} unread
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600">
            Form submissions received via public contact
          </p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-500">
              Project Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Icon name="visibility" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-stone-950">
              {INITIAL_ADMIN_ANALYTICS.overview.totalProjectViews.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-emerald-700 font-medium">
              ASOCOMMS top
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Across 4 active showcased architectures
          </p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-stone-500">
              Peer Reviews
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Icon name="rate_review" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-stone-950">
              {INITIAL_ADMIN_REVIEWS.length}
            </span>
            {pendingReviews.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                {pendingReviews.length} pending
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600">
            BCOS ICT, Agency lead & academic feedback
          </p>
        </div>
      </div>

      {/* 2. Main Content Split: Recent Inquiries + Projects Quick Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Messages */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold font-display text-stone-900">
                Recent Inbound Messages
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Messages submitted through /contact
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin/messages')}
            >
              View All ({INITIAL_ADMIN_MESSAGES.length})
            </Button>
          </div>

          <div className="divide-y divide-stone-100">
            {INITIAL_ADMIN_MESSAGES.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigate('/admin/messages')}
                className="p-5 hover:bg-stone-50 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                    )}
                    <span className="text-sm font-semibold text-stone-900">
                      {msg.senderName}
                    </span>
                    <span className="text-xs font-mono text-stone-500 hidden sm:inline">
                      &lt;{msg.senderEmail}&gt;
                    </span>
                  </div>
                  <span className="text-xs font-mono text-stone-500 shrink-0">
                    {msg.receivedAt}
                  </span>
                </div>

                <p className="text-xs font-medium text-stone-800">
                  {msg.subject || 'Direct portfolio message'}
                </p>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Architecture & Quick Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Architecture Status Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-500">
                ARCHITECTURE STACK
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Frontend Active</span>
              </span>
            </div>

            <ul className="space-y-3 text-xs font-mono">
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  <Icon name="check_circle" size="sm" className="text-emerald-600" />
                  <span>Admin Interface UI</span>
                </div>
                <span className="text-emerald-700 font-semibold">Ready</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-700">
                  <Icon name="pending" size="sm" className="text-amber-600" />
                  <span>Express API Routing</span>
                </div>
                <span className="text-stone-500">Next Stage</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-700">
                  <Icon name="pending" size="sm" className="text-amber-600" />
                  <span>MongoDB Database</span>
                </div>
                <span className="text-stone-500">Next Stage</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-stone-700">
                  <Icon name="pending" size="sm" className="text-amber-600" />
                  <span>JWT Auth & Sessions</span>
                </div>
                <span className="text-stone-500">Next Stage</span>
              </li>
            </ul>

            <div className="pt-1">
              <Button
                variant="outline"
                size="sm"
                leftIcon="refresh"
                className="w-full text-xs font-mono"
                onClick={() => onNavigate('/admin/projects')}
              >
                Manage Projects Catalog
              </Button>
            </div>
          </div>

          {/* Quick Review Moderation Teaser */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-stone-900">
                Review Moderation
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                1 Pending
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              New academic peer submission from LAUTECH awaiting review before appearing on public views.
            </p>
            <Button
              variant="outline"
              size="sm"
              rightIcon="arrow_forward"
              onClick={() => onNavigate('/admin/reviews')}
            >
              Open Reviews Queue
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Published Projects Overview Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold font-display text-stone-900">
              Project Catalog Summary
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Engineering builds displayed across /projects and homepage
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon="add"
            onClick={() => onNavigate('/admin/projects')}
          >
            Add New Project
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 font-mono text-stone-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Title & Slug</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 font-semibold">Tech Stack</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {INITIAL_ADMIN_PROJECTS.map((project) => (
                <tr key={project.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900 text-sm">
                      {project.title}
                    </div>
                    <div className="font-mono text-[11px] text-stone-500">
                      /{project.slug}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {project.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono capitalize ${
                        project.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : project.status === 'draft'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {project.isFeatured ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        <Icon name="star" size="sm" className="text-[12px] text-amber-600" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 font-mono text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] font-mono text-stone-400 self-center">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('/admin/projects')}
                      className="px-2.5 py-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-mono text-[11px] border border-stone-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

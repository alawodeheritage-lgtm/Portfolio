import React from 'react';
import { Icon } from '../ui/Icon';
import { INITIAL_ADMIN_ANALYTICS } from '../../data/adminMockData';

export const AdminAnalytics: React.FC = () => {
  const { overview, topReferrers, projectTraffic } = INITIAL_ADMIN_ANALYTICS;

  return (
    <div className="space-y-8 max-w-7xl mx-auto" id="admin-analytics-root">
      {/* 1. Core Engagement Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>Estimated Visitors</span>
            <Icon name="groups" size="sm" />
          </div>
          <div className="text-3xl font-bold font-display text-stone-950">
            {overview.monthlyVisitors}
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Unique IP origins this month
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>Total Project Reads</span>
            <Icon name="visibility" size="sm" />
          </div>
          <div className="text-3xl font-bold font-display text-stone-950">
            {overview.totalProjectViews.toLocaleString()}
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Across all case-study views
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>Direct Inquiries</span>
            <Icon name="send" size="sm" />
          </div>
          <div className="text-3xl font-bold font-display text-stone-950">
            {overview.inquiriesReceived}
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Submitted via /contact
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider">
            <span>Inquiry Conversion</span>
            <Icon name="trending_up" size="sm" />
          </div>
          <div className="text-3xl font-bold font-display text-stone-950">
            {((overview.inquiriesReceived / overview.monthlyVisitors) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Visitor-to-inquiry ratio
          </p>
        </div>
      </div>

      {/* 2. Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Project Traffic Breakdown Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display text-stone-900">
                Engagement by Project Architecture
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                Breakdown of case-study views and related direct inquiries
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">
              Ranked by views
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 font-mono text-stone-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Project Title</th>
                  <th className="py-3 px-4 font-semibold text-right">Views</th>
                  <th className="py-3 px-4 font-semibold text-right">Inquiries</th>
                  <th className="py-3 px-4 font-semibold">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {projectTraffic.map((proj) => {
                  const pct = Math.round((proj.views / overview.totalProjectViews) * 100);
                  return (
                    <tr key={proj.slug} className="hover:bg-stone-50/60">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900 text-sm">
                          {proj.title}
                        </div>
                        <div className="font-mono text-[11px] text-stone-500">
                          /{proj.slug}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-900 text-right">
                        {proj.views}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-700 text-right">
                        {proj.inquiries}
                      </td>
                      <td className="py-3.5 px-4 w-40">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-stone-500">
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-stone-900 h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Traffic Sources Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold font-display text-stone-900">
              Referral Sources
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Where technical visitors discovered the portfolio
            </p>
          </div>

          <div className="space-y-4">
            {topReferrers.map((ref) => (
              <div key={ref.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-medium text-stone-800">{ref.source}</span>
                  <span className="text-stone-500">
                    {ref.count} visits ({ref.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-stone-600 space-y-1">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <Icon name="info" size="sm" className="text-stone-500" />
              <span>Telemetry Notice</span>
            </div>
            <p className="font-sans text-stone-600 leading-relaxed text-xs">
              Demonstrates functional analytics UI layout. Real aggregation pipelines will be wired through MongoDB telemetry queries during backend setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

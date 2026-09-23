export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
}

export type ProjectPublishStatus = 'published' | 'draft' | 'archived';

export interface AdminProjectItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  status: ProjectPublishStatus;
  isFeatured: boolean;
  lastModified: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export type ReviewStatus = 'approved' | 'pending' | 'archived';

export interface AdminReviewItem {
  id: string;
  authorName: string;
  authorRole: string;
  organization: string;
  relationship: 'peer' | 'client' | 'mentor' | 'colleague';
  content: string;
  status: ReviewStatus;
  submittedAt: string;
}

export interface AdminMessageItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject?: string;
  message: string;
  receivedAt: string;
  isRead: boolean;
  isArchived: boolean;
  category?: 'Inquiry' | 'Collaboration' | 'Feedback' | 'Opportunity';
  projectContext?: string;
}

export interface ReferrerMetric {
  source: string;
  count: number;
  percentage: number;
}

export interface ProjectTrafficMetric {
  title: string;
  slug: string;
  views: number;
  inquiries: number;
}

export interface AdminAnalyticsData {
  overview: {
    monthlyVisitors: number;
    totalProjectViews: number;
    inquiriesReceived: number;
    publishedProjectsCount: number;
  };
  topReferrers: ReferrerMetric[];
  projectTraffic: ProjectTrafficMetric[];
}

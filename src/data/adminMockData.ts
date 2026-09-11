import {
  AdminNavItem,
  AdminProjectItem,
  AdminReviewItem,
  AdminMessageItem,
  AdminAnalyticsData,
} from '../types/admin';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'dashboard',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/admin/projects',
    icon: 'folder_open',
    badge: '4',
  },
  {
    id: 'reviews',
    label: 'Reviews',
    href: '/admin/reviews',
    icon: 'rate_review',
    badge: '1 pending',
  },
  {
    id: 'messages',
    label: 'Messages',
    href: '/admin/messages',
    icon: 'mail',
    badge: '2 new',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'analytics',
  },
];

export const INITIAL_ADMIN_PROJECTS: AdminProjectItem[] = [
  {
    id: 'p1',
    title: 'ASOCOMMS — Repair Management System',
    slug: 'asocomms',
    category: 'Full-Stack Management System',
    status: 'published',
    isFeatured: true,
    lastModified: 'March 1, 2026',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/example/asocomms',
    liveUrl: 'https://asocomms-demo.example.com',
  },
  {
    id: 'p2',
    title: 'Financial Visualizer / FinTrack',
    slug: 'fintrack',
    category: 'Web Application',
    status: 'published',
    isFeatured: false,
    lastModified: 'February 24, 2026',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB'],
    githubUrl: 'https://github.com/example/fintrack',
  },
  {
    id: 'p3',
    title: 'SwiftTask',
    slug: 'swifttask',
    category: 'Productivity Tool',
    status: 'published',
    isFeatured: false,
    lastModified: 'February 18, 2026',
    techStack: ['React', 'HTML5 Drag and Drop', 'Local Storage'],
    githubUrl: 'https://github.com/example/swifttask',
  },
  {
    id: 'p4',
    title: 'Netflix Clone',
    slug: 'netflix-clone',
    category: 'Frontend Engineering & Media API',
    status: 'published',
    isFeatured: false,
    lastModified: 'February 10, 2026',
    techStack: ['React', 'TMDB REST API', 'Axios', 'Tailwind CSS'],
    githubUrl: 'https://github.com/example/netflix-clone',
  },
];

export const INITIAL_ADMIN_REVIEWS: AdminReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Senior ICT Colleague',
    authorRole: 'Systems Technician',
    organization: 'Broadcasting Corporation of Oyo State (BCOS)',
    relationship: 'colleague',
    content:
      'Worked alongside Heritage during his SIWES rotation. Demonstrated quiet discipline, reliable hardware troubleshooting skills, and was always ready to learn and assist staff with IT challenges.',
    status: 'approved',
    submittedAt: 'Oct 14, 2025',
  },
  {
    id: 'rev-2',
    authorName: 'Agency Web Lead',
    authorRole: 'Creative Director & Web Lead',
    organization: 'Web & Branding Agency',
    relationship: 'mentor',
    content:
      'Showed strong attention to typography hierarchy, spacing, and responsive fidelity when building client web layouts. Takes constructive feedback seriously and executes cleanly.',
    status: 'approved',
    submittedAt: 'Nov 02, 2025',
  },
  {
    id: 'rev-3',
    authorName: 'Academic Peer (LAUTECH)',
    authorRole: 'Computer Science Student',
    organization: 'LAUTECH Department of Computer Science',
    relationship: 'peer',
    content:
      'Consistently takes initiative during group programming assignments. His focus on structured architecture and clear documentation makes collaboration straightforward.',
    status: 'pending',
    submittedAt: 'Feb 18, 2026',
  },
];

export const INITIAL_ADMIN_MESSAGES: AdminMessageItem[] = [
  {
    id: 'msg-1',
    senderName: 'Tunde Adeleke',
    senderEmail: 't.adeleke@techpartners.mock',
    subject: 'Inquiry regarding ASOCOMMS system architecture',
    message:
      'Good day Heritage,\n\nI came across your portfolio and was particularly interested in the 3-tier MERN architecture writeup for ASOCOMMS. The way you handled equipment lifecycle statuses and service ticket isolation matches challenges we encounter in commercial equipment servicing.\n\nAre you open to a brief technical conversation regarding full-stack engineering internship or contract opportunities with our team?\n\nBest regards,\nTunde Adeleke\nTechnical Recruiter | TechPartners Nigeria',
    receivedAt: 'Today at 09:24 AM',
    isRead: false,
    isArchived: false,
    category: 'Opportunity',
    projectContext: 'ASOCOMMS — Repair Management System',
  },
  {
    id: 'msg-2',
    senderName: 'Fola Bakare',
    senderEmail: 'folabakare@student.lautech.mock',
    subject: 'Project collaboration & web development',
    message:
      'Hello Heritage,\n\nI reviewed your clean portfolio design and typography choices. We are preparing an open-source student utility platform for the Computer Science department and would appreciate your input on layout structure and state management.\n\nLet me know if you have some bandwidth this semester to discuss collaboration.\n\nCheers,\nFola Bakare',
    receivedAt: 'Yesterday at 04:12 PM',
    isRead: false,
    isArchived: false,
    category: 'Collaboration',
    projectContext: 'Department Collaboration',
  },
  {
    id: 'msg-3',
    senderName: 'David Oladipo',
    senderEmail: 'david.dev@outlook.mock',
    subject: 'Feedback on SwiftTask drag-and-drop',
    message:
      'Hi Heritage,\n\nJust tested SwiftTask on both desktop and mobile viewports. I really appreciate that you avoided heavy external drag-and-drop packages and instead used native HTML5 drag events with clean state handlers.\n\nOne small observation: on smaller touchscreens, adding touch-action: pan-y or subtle haptic vibration improves the drag feedback. Otherwise, excellent job on maintaining zero dependencies!\n\nBest,\nDavid',
    receivedAt: '3 days ago',
    isRead: true,
    isArchived: false,
    category: 'Feedback',
    projectContext: 'SwiftTask',
  },
  {
    id: 'msg-4',
    senderName: 'Kemi Adebayo',
    senderEmail: 'kemi.consults@consulting.mock',
    subject: 'Website redesign consultation',
    message:
      'Hello Heritage,\n\nI came across your agency client projects and SIWES experience at BCOS. Our advisory practice is looking to revamp our web presence with a focus on fast load times, accessibility, and clean typography.\n\nCould you share your current availability and consultation rates for a 3-week redesign cycle?\n\nRegards,\nKemi Adebayo\nPrincipal Consultant',
    receivedAt: '1 week ago',
    isRead: true,
    isArchived: true,
    category: 'Inquiry',
    projectContext: 'Client Consultation',
  },
  {
    id: 'msg-5',
    senderName: 'Michael Vance',
    senderEmail: 'm.vance@apexlogic.mock',
    subject: 'FinTrack Data Visualization query',
    message:
      'Good afternoon,\n\nSaw your FinTrack personal finance case study. I liked how you combined transaction categorization with responsive visual summaries. Are you planning to add CSV export or multi-currency support in an upcoming iteration?\n\nKeep up the great work,\nMichael Vance',
    receivedAt: '2 weeks ago',
    isRead: true,
    isArchived: false,
    category: 'Feedback',
    projectContext: 'FinTrack',
  },
  {
    id: 'msg-6',
    senderName: 'Dr. A. Babalola',
    senderEmail: 'a.babalola@faculty.lautech.mock',
    subject: 'Seminar technical documentation review',
    message:
      'Hello Heritage,\n\nPlease make sure your final year technical project documentation adheres to the IEEE formatting standards outlined in our previous departmental briefing. Your progress report on the system architecture was well structured.\n\nRegards,\nDr. A. Babalola',
    receivedAt: '3 weeks ago',
    isRead: true,
    isArchived: true,
    category: 'Inquiry',
    projectContext: 'Academic Department',
  },
];

export const INITIAL_ADMIN_ANALYTICS: AdminAnalyticsData = {
  overview: {
    monthlyVisitors: 412,
    totalProjectViews: 1280,
    inquiriesReceived: 14,
    publishedProjectsCount: 4,
  },
  topReferrers: [
    { source: 'Direct / Portfolio Link', count: 680, percentage: 53 },
    { source: 'GitHub Repositories', count: 340, percentage: 27 },
    { source: 'LinkedIn Profile', count: 185, percentage: 14 },
    { source: 'LAUTECH Student Tech Forum', count: 75, percentage: 6 },
  ],
  projectTraffic: [
    {
      title: 'ASOCOMMS Enterprise Repair & Inventory',
      slug: 'asocomms',
      views: 742,
      inquiries: 8,
    },
    {
      title: 'FinTrack Personal Finance Tracker',
      slug: 'fintrack',
      views: 265,
      inquiries: 3,
    },
    {
      title: 'SwiftTask Lightweight Kanban Board',
      slug: 'swifttask',
      views: 188,
      inquiries: 2,
    },
    {
      title: 'Netflix Clone Streaming Interface',
      slug: 'netflix-clone',
      views: 85,
      inquiries: 1,
    },
  ],
};

import { Project } from '../types/project';

export const SELECTED_PROJECTS: Project[] = [
  {
    id: 'asocomms',
    slug: 'asocomms',
    title: 'ASOCOMMS',
    tagline: 'Repair Management System',
    category: 'Full-Stack Engineering',
    description:
      'A dedicated full-stack repair management system built to manage hardware repair lifecycles, technician work assignments, work-order status tracking, and spare parts inventory within a unified operational dashboard.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
    isFeatured: true,
    isFlagship: true,
    highlights: [
      'Complete repair lifecycle: intake, diagnostic notes, repair progress, and completion',
      'Modular REST API services with Express.js and structured MongoDB schemas',
      'Component-level inventory allocation and real-time status updates',
      'Role-tailored interfaces for technicians and service coordinators',
    ],
    caseStudyUrl: '/projects/asocomms',
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 'fintrack',
    slug: 'fintrack',
    title: 'Financial Visualizer / FinTrack',
    tagline: 'Expense Tracking & Cash Flow Visualization',
    category: 'Data & Visualization',
    description:
      'An interactive financial utility designed to monitor income and expenditures, group transactions into custom categories, and render clear graphical visualizers to evaluate spending habits over time.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
    isFeatured: true,
    isFlagship: false,
    highlights: [
      'Categorized transaction entry with dynamic summary statistics',
      'Visual cash flow breakdown and monthly expense distribution',
      'Filtered transaction histories by date range and expense category',
    ],
    caseStudyUrl: '/projects/fintrack',
    githubUrl: '#',
  },
  {
    id: 'swifttask',
    slug: 'swifttask',
    title: 'SwiftTask',
    tagline: 'Task Management & Personal Productivity',
    category: 'Web Application',
    description:
      'A streamlined productivity application built for fast daily task capture, priority-based organization, status stage transitions, and clear progress visibility with minimal cognitive friction.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    isFeatured: true,
    isFlagship: false,
    highlights: [
      'Structured task pipelines (Todo, In Progress, Complete)',
      'Priority flags, due date indicators, and filterable tag views',
      'Persistent local workspace state with keyboard-first navigation',
    ],
    caseStudyUrl: '/projects/swifttask',
    githubUrl: '#',
  },
  {
    id: 'netflix-clone',
    slug: 'netflix-clone',
    title: 'Netflix Clone',
    tagline: 'Streaming Interface Frontend Recreation',
    category: 'Frontend Engineering',
    description:
      'A high-fidelity frontend recreation exploring media streaming platform layout systems, dynamic catalog carousels, backdrop banner transitions, and responsive content modals.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    isFeatured: false,
    isFlagship: false,
    highlights: [
      'Dynamic content shelf scrolling with smooth responsive breakpoints',
      'Detailed media modal presentation with metadata overlays',
      'Precise mobile-to-desktop viewport adaptability',
    ],
    caseStudyUrl: '/projects/netflix-clone',
    githubUrl: '#',
  },
];

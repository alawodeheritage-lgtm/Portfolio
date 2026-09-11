import { TechGroup, LearningFocus } from '../types/skills';

export const CORE_TECH_GROUPS: TechGroup[] = [
  {
    category: 'Languages & Core Foundations',
    description: 'Foundational programming languages used across frontend and backend systems.',
    items: [
      {
        name: 'TypeScript',
        focus: 'Strict typing, shared interfaces, and component prop safety',
        context: 'Primary language for reliable web applications',
      },
      {
        name: 'JavaScript',
        focus: 'ES6+ syntax, asynchronous programming, and DOM APIs',
        context: 'Core runtime foundation for web development',
      },
    ],
  },
  {
    category: 'Frontend Engineering',
    description: 'Libraries and frameworks used to construct modular, responsive user interfaces.',
    items: [
      {
        name: 'React',
        focus: 'Component architecture, custom hooks, and state management',
        context: 'Core UI foundation for project interfaces',
      },
      {
        name: 'Next.js',
        focus: 'Page structure, SSR/SSG concepts, and production layouts',
        context: 'Modern React framework for scalable web apps',
      },
      {
        name: 'Tailwind CSS',
        focus: 'Utility-first styling, design tokens, and responsive layouts',
        context: 'Primary styling engine for clean, maintainable UI',
      },
    ],
  },
  {
    category: 'Backend & Data Persistence',
    description: 'Server runtime, API routing, and document-based data management.',
    items: [
      {
        name: 'Node.js',
        focus: 'Server-side execution and npm package ecosystem',
        context: 'Backend runtime environment',
      },
      {
        name: 'Express.js',
        focus: 'RESTful route handlers, middleware pipelines, and error handling',
        context: 'Web framework for backend API services',
      },
      {
        name: 'MongoDB',
        focus: 'Document storage, collections, and query operations',
        context: 'NoSQL database for persistent application data',
      },
      {
        name: 'Mongoose',
        focus: 'Schema definitions, data validation, and model methods',
        context: 'Object Data Modeling (ODM) layer for MongoDB',
      },
    ],
  },
  {
    category: 'Version Control & Workflow',
    description: 'Tools for code versioning, repository management, and collaboration.',
    items: [
      {
        name: 'Git',
        focus: 'Branching, commit hygiene, and version history tracking',
        context: 'Standard version control system',
      },
      {
        name: 'GitHub',
        focus: 'Remote repositories, documentation, and project tracking',
        context: 'Code hosting and collaboration platform',
      },
    ],
  },
];

export const CURRENTLY_EXPLORING: LearningFocus[] = [
  {
    area: 'Frontend Architecture',
    topic: 'Next.js Routing & Data Fetching',
    note: 'Deepening understanding of modern Next.js patterns, layout nesting, and performance optimization.',
    status: 'Deepening',
  },
  {
    area: 'Backend Systems',
    topic: 'REST API Design & Validation',
    note: 'Refining Express.js controller separation, centralized error middleware, and robust Mongoose schema validations.',
    status: 'In Progress',
  },
  {
    area: 'Engineering Workflow',
    topic: 'Git Collaboration & Clean Commits',
    note: 'Practicing disciplined commit messages, feature branching, and documentation to build software that is easy to maintain.',
    status: 'In Progress',
  },
];

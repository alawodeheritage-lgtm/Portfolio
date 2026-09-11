export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  technologies: string[];
  isFeatured?: boolean;
  isFlagship?: boolean;
  highlights?: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl: string;
}

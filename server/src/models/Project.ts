import { Document, Model, Schema, model } from 'mongoose';

export interface ProjectMedia {
  url: string;
  type?: string;
  alt?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline?: string;
  category?: string;
  description: string;
  technologies: string[];
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  media: ProjectMedia[];
  caseStudyContent?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDocument = Project & Document;

const projectMediaSchema = new Schema<ProjectMedia>(
  {
    url: { type: String, required: true, trim: true },
    type: { type: String, trim: true },
    alt: { type: String, trim: true },
  },
  { _id: false },
);

const projectSchema = new Schema<ProjectDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    highlights: {
      type: [String],
      required: true,
      default: [],
    },
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    caseStudyUrl: { type: String, trim: true },
    media: {
      type: [projectMediaSchema],
      default: [],
    },
    caseStudyContent: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectSchema.index({ isPublished: 1, isFeatured: 1 });

export const ProjectModel: Model<ProjectDocument> = model<ProjectDocument>('Project', projectSchema);

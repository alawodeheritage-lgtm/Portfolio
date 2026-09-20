import type { RequestHandler } from 'express';
import { ProjectModel, type ProjectDocument } from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

const publicProjectFields = [
  '_id',
  'slug',
  'title',
  'tagline',
  'category',
  'description',
  'technologies',
  'highlights',
  'media',
  'githubUrl',
  'liveUrl',
  'caseStudyUrl',
  'caseStudyContent',
  'isPublished',
  'isFeatured',
  'createdAt',
  'updatedAt',
].join(' ');

function toPublicProject(project: ProjectDocument) {
  return {
    id: project._id.toString(),
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    category: project.category,
    description: project.description,
    technologies: project.technologies,
    highlights: project.highlights,
    media: project.media.map((media) => media.url),
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    caseStudyUrl: project.caseStudyUrl,
    caseStudyContent: project.caseStudyContent,
    isPublished: project.isPublished,
    isFeatured: project.isFeatured,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export const listPublishedProjects: RequestHandler = asyncHandler(async (_request, response) => {
  const projects = await ProjectModel.find({ isPublished: true })
    .select(publicProjectFields)
    .sort({ createdAt: -1 })
    .exec();

  response.status(200).json({ projects: projects.map(toPublicProject) });
});

export const listFeaturedProjects: RequestHandler = asyncHandler(async (_request, response) => {
  const projects = await ProjectModel.find({ isPublished: true, isFeatured: true })
    .select(publicProjectFields)
    .sort({ createdAt: -1 })
    .exec();

  response.status(200).json({ projects: projects.map(toPublicProject) });
});

export const getPublishedProjectBySlug: RequestHandler = asyncHandler(async (request, response) => {
  const project = await ProjectModel.findOne({
    slug: request.params.slug,
    isPublished: true,
  })
    .select(publicProjectFields)
    .exec();

  if (!project) {
    throw new HttpError(404, 'Project not found');
  }

  response.status(200).json({ project: toPublicProject(project) });
});

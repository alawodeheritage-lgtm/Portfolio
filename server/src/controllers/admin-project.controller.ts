import type { RequestHandler } from 'express';
import { ProjectModel, type ProjectDocument } from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';

function toAdminProject(project: ProjectDocument) {
  const value = project.toObject() as Record<string, unknown> & {
    _id: { toString(): string };
  };
  const { _id, __v: _version, ...fields } = value;

  return { id: _id.toString(), ...fields };
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

function rethrowProjectError(error: unknown): never {
  if (isDuplicateKeyError(error)) {
    throw new HttpError(409, 'A project with that slug already exists');
  }

  throw error;
}

export const listAdminProjects: RequestHandler = asyncHandler(async (_request, response) => {
  const projects = await ProjectModel.find().sort({ createdAt: -1 }).exec();
  response.status(200).json({ projects: projects.map(toAdminProject) });
});

export const createAdminProject: RequestHandler = asyncHandler(async (request, response) => {
  try {
    const project = await ProjectModel.create(request.body);
    response.status(201).json({ project: toAdminProject(project) });
  } catch (error: unknown) {
    rethrowProjectError(error);
  }
});

export const updateAdminProject: RequestHandler = asyncHandler(async (request, response) => {
  try {
    const project = await ProjectModel.findByIdAndUpdate(
      request.params.id,
      { $set: request.body },
      { new: true, runValidators: true, context: 'query' },
    ).exec();

    if (!project) {
      throw new HttpError(404, 'Project not found');
    }

    response.status(200).json({ project: toAdminProject(project) });
  } catch (error: unknown) {
    rethrowProjectError(error);
  }
});

export const deleteAdminProject: RequestHandler = asyncHandler(async (request, response) => {
  const project = await ProjectModel.findByIdAndDelete(request.params.id).exec();

  if (!project) {
    throw new HttpError(404, 'Project not found');
  }

  response.status(200).json({ message: 'Project deleted successfully' });
});

async function updateProjectState(
  projectId: string,
  field: 'isPublished' | 'isFeatured',
  value: boolean,
): Promise<ProjectDocument> {
  const project = await ProjectModel.findByIdAndUpdate(
    projectId,
    { $set: { [field]: value } },
    { new: true, runValidators: true },
  ).exec();

  if (!project) {
    throw new HttpError(404, 'Project not found');
  }

  return project;
}

export const setProjectPublished: RequestHandler = asyncHandler(async (request, response) => {
  const project = await updateProjectState(
    Array.isArray(request.params.id) ? request.params.id[0] : request.params.id,
    'isPublished',
    request.body.value,
  );

  response.status(200).json({ project: toAdminProject(project) });
});

export const setProjectFeatured: RequestHandler = asyncHandler(async (request, response) => {
  const project = await updateProjectState(
    Array.isArray(request.params.id) ? request.params.id[0] : request.params.id,
    'isFeatured',
    request.body.value,
  );

  response.status(200).json({ project: toAdminProject(project) });
});

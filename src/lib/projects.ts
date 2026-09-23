const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface AdminProjectApiProject {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  category?: string;
  description: string;
  technologies: string[];
  highlights: string[];
  media: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  caseStudyContent?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsResponse {
  projects: AdminProjectApiProject[];
}

interface ProjectResponse {
  project: AdminProjectApiProject;
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readError(response, 'Project request failed.'));
  }

  return (await response.json()) as T;
}

export async function fetchAdminProjects(): Promise<AdminProjectApiProject[]> {
  const response = await request<ProjectsResponse>('/api/admin/projects');
  return response.projects;
}

export async function createAdminProject(payload: Record<string, unknown>): Promise<AdminProjectApiProject> {
  const response = await request<ProjectResponse>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.project;
}

export async function updateAdminProject(
  id: string,
  payload: Record<string, unknown>,
): Promise<AdminProjectApiProject> {
  const response = await request<ProjectResponse>(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response.project;
}

export async function deleteAdminProject(id: string): Promise<void> {
  await request<{ message: string }>(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function setAdminProjectPublished(
  id: string,
  value: boolean,
): Promise<AdminProjectApiProject> {
  const response = await request<ProjectResponse>(`/api/admin/projects/${encodeURIComponent(id)}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  });
  return response.project;
}

export async function setAdminProjectFeatured(
  id: string,
  value: boolean,
): Promise<AdminProjectApiProject> {
  const response = await request<ProjectResponse>(`/api/admin/projects/${encodeURIComponent(id)}/featured`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  });
  return response.project;
}

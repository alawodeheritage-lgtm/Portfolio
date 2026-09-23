import React, { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { AdminProjectItem, ProjectPublishStatus } from '../../types/admin';
import {
  AdminProjectApiProject,
  createAdminProject,
  deleteAdminProject,
  fetchAdminProjects,
  setAdminProjectFeatured,
  setAdminProjectPublished,
  updateAdminProject,
} from '../../lib/projects';

interface AdminProjectsProps {
  onNavigate: (path: string) => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<AdminProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<AdminProjectItem | null>(null);

  // Notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // New Project Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Full-Stack Management System');
  const [formTech, setFormTech] = useState('');
  const [formStatus, setFormStatus] = useState<ProjectPublishStatus>('published');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formGithub, setFormGithub] = useState('');
  const [formLive, setFormLive] = useState('');

  const toAdminProjectItem = (project: AdminProjectApiProject): AdminProjectItem => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category || 'Software Project',
    status: project.isPublished ? 'published' : 'draft',
    isFeatured: project.isFeatured,
    lastModified: new Date(project.updatedAt).toLocaleDateString(),
    techStack: project.technologies,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
  });

  const replaceProject = (project: AdminProjectApiProject) => {
    setProjects((current) => {
      const next = toAdminProjectItem(project);
      const exists = current.some((item) => item.id === next.id);
      return exists ? current.map((item) => (item.id === next.id ? next : item)) : [next, ...current];
    });
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    fetchAdminProjects()
      .then((items) => {
        if (active) setProjects(items.map(toAdminProjectItem));
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load projects.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Filtered project list
  const filteredProjects = projects.filter((p) => {
    if (filter === 'published' && p.status !== 'published') return false;
    if (filter === 'draft' && p.status !== 'draft') return false;
    if (filter === 'featured' && !p.isFeatured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Action: Toggle Featured
  const handleToggleFeatured = async (project: AdminProjectItem) => {
    const nextState = !project.isFeatured;
    try {
      setIsSaving(true);
      replaceProject(await setAdminProjectFeatured(project.id, nextState));
      showNotification(nextState ? `"${project.title}" marked as featured.` : `"${project.title}" removed from featured.`);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to update featured state.');
    } finally {
      setIsSaving(false);
    }
  };

  // Action: Publish / Unpublish Toggle
  const handleTogglePublish = async (project: AdminProjectItem) => {
    const nextStatus: ProjectPublishStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      setIsSaving(true);
      replaceProject(await setAdminProjectPublished(project.id, nextStatus === 'published'));
      showNotification(nextStatus === 'published' ? `"${project.title}" is now Published.` : `"${project.title}" unpublished (set to Draft).`);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to update publish state.');
    } finally {
      setIsSaving(false);
    }
  };

  // Action: Delete
  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    const title = deletingProject.title;
    try {
      setIsSaving(true);
      await deleteAdminProject(deletingProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      setDeletingProject(null);
      showNotification(`"${title}" deleted.`);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to delete project.');
    } finally {
      setIsSaving(false);
    }
  };

  // Action: Open Edit Modal
  const handleOpenEdit = (project: AdminProjectItem) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormSlug(project.slug);
    setFormDescription(project.description || '');
    setFormCategory(project.category);
    setFormTech(project.techStack.join(', '));
    setFormStatus(project.status);
    setFormFeatured(project.isFeatured);
    setFormGithub(project.githubUrl || '');
    setFormLive(project.liveUrl || '');
  };

  // Action: Open Add Modal
  const handleOpenAdd = () => {
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormCategory('Full-Stack Management System');
    setFormTech('');
    setFormStatus('published');
    setFormFeatured(false);
    setFormGithub('');
    setFormLive('');
    setShowAddModal(true);
  };

  // Action: Submit Create
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const slug = (
      formSlug.trim() ||
      formTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    );

    try {
      setIsSaving(true);
      const project = await createAdminProject({
        title: formTitle.trim(),
        slug,
        category: formCategory.trim() || 'Software Project',
        description: formDescription.trim(),
        technologies: formTech ? formTech.split(',').map((t) => t.trim()).filter(Boolean) : [],
        highlights: [],
        media: [],
        githubUrl: formGithub.trim(),
        liveUrl: formLive.trim(),
        isPublished: formStatus === 'published',
        isFeatured: formFeatured,
      });
      replaceProject(project);
      setShowAddModal(false);
      showNotification(`Project "${project.title}" created successfully.`);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to create project.');
    } finally {
      setIsSaving(false);
    }
  };

  // Action: Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !formTitle.trim() || !formDescription.trim()) return;

    try {
      setIsSaving(true);
      const project = await updateAdminProject(editingProject.id, {
        title: formTitle.trim(),
        slug: formSlug.trim() || editingProject.slug,
        category: formCategory.trim() || editingProject.category,
        description: formDescription.trim(),
        technologies: formTech ? formTech.split(',').map((t) => t.trim()).filter(Boolean) : [],
        isPublished: formStatus === 'published',
        isFeatured: formFeatured,
        githubUrl: formGithub.trim(),
        liveUrl: formLive.trim(),
      });
      replaceProject(project);
      showNotification(`Project "${project.title}" updated successfully.`);
      setEditingProject(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to update project.');
    } finally {
      setIsSaving(false);
    }
  };

  const counts = {
    all: projects.length,
    published: projects.filter((p) => p.status === 'published').length,
    draft: projects.filter((p) => p.status === 'draft').length,
    featured: projects.filter((p) => p.isFeatured).length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="admin-projects-root">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-mono px-4 py-3 rounded-lg border border-stone-800 shadow-md flex items-center gap-2"
        >
          <Icon name="check_circle" size="sm" className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {loadError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800" role="alert">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 font-mono text-xs">
          Loading projects from the server...
        </div>
      )}

      {/* Practical Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        {/* Left: Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1 lg:pb-0" id="admin-projects-filter-bar">
          <button
            id="filter-all-projects-btn"
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${filter === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
          >
            All Projects ({counts.all})
          </button>
          <button
            id="filter-published-projects-btn"
            type="button"
            onClick={() => setFilter('published')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${filter === 'published'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
          >
            Published ({counts.published})
          </button>
          <button
            id="filter-draft-projects-btn"
            type="button"
            onClick={() => setFilter('draft')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${filter === 'draft'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
          >
            Drafts ({counts.draft})
          </button>
          <button
            id="filter-featured-projects-btn"
            type="button"
            onClick={() => setFilter('featured')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${filter === 'featured'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
          >
            <Icon name="star" size="sm" className="text-[13px] text-amber-500" />
            <span>Featured ({counts.featured})</span>
          </button>
        </div>

        {/* Right: Search & Add Project CTA */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Icon
              name="search"
              size="sm"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              id="admin-projects-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tech..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs font-sans placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
            {searchQuery && (
              <button
                id="clear-projects-search-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ×
              </button>
            )}
          </div>

          <Button
            id="admin-add-project-cta"
            variant="primary"
            size="sm"
            leftIcon="add"
            onClick={handleOpenAdd}
          >
            Add Project
          </Button>
        </div>
      </div>

      {/* Desktop Projects Table (Visible on md and above) */}
      <div className={`hidden md:block bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 font-mono text-stone-500 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-semibold">Project Name</th>
              <th className="py-3.5 px-4 font-semibold">Technologies</th>
              <th className="py-3.5 px-4 font-semibold">Published</th>
              <th className="py-3.5 px-4 font-semibold">Featured</th>
              <th className="py-3.5 px-4 font-semibold">Last Updated</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-sans">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-500 font-mono">
                  <div className="max-w-sm mx-auto space-y-2">
                    <Icon name="folder_off" size="lg" className="mx-auto text-stone-300 text-3xl" />
                    <p className="text-sm font-semibold text-stone-800 font-display">
                      No matching projects
                    </p>
                    <p className="text-xs text-stone-500 font-sans">
                      {searchQuery
                        ? `No projects match "${searchQuery}". Try refining your search query.`
                        : 'No projects found in this category view.'}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setFilter('all');
                        }}
                        className="text-xs font-mono text-stone-900 underline hover:text-stone-600 pt-1"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => {
                const isASOCOMMS = p.slug === 'asocomms';
                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Project Name & Meta */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-950 text-sm">
                          {p.title}
                        </span>
                        {p.isFeatured && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-300 shrink-0"
                            title="Featured Project Highlight"
                          >
                            <Icon name="star" size="sm" className="text-[11px] text-amber-600" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span>slug: /{p.slug}</span>
                        <span>•</span>
                        <span className="text-stone-600">{p.category}</span>
                      </div>
                    </td>

                    {/* Technologies */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Published Status Indicator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {p.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[11px] bg-stone-100 text-stone-600 border border-stone-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    {/* Featured Status Indicator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded font-mono text-xs transition-colors ${p.isFeatured
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-medium hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200 border border-stone-200'
                          }`}
                        title={p.isFeatured ? 'Click to unmark as featured' : 'Click to mark as featured'}
                      >
                        <Icon
                          name={p.isFeatured ? 'star' : 'star_border'}
                          size="sm"
                          className={p.isFeatured ? 'text-amber-600 text-[13px]' : 'text-stone-400 text-[13px]'}
                        />
                        <span>{p.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                      {p.lastModified}
                    </td>

                    {/* Available Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs">
                        {/* Publish / Unpublish Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p)}
                          className={`px-2 py-1 rounded border text-[11px] transition-colors ${p.status === 'published'
                              ? 'border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                          title={p.status === 'published' ? 'Unpublish (move to Draft)' : 'Publish project'}
                        >
                          {p.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="px-2 py-1 rounded border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
                          title="Edit project details"
                        >
                          Edit
                        </button>

                        {/* View Public Page */}
                        <button
                          type="button"
                          onClick={() => onNavigate(`/projects/${p.slug}`)}
                          className="p-1 rounded text-stone-400 hover:text-stone-800 hover:bg-stone-100"
                          title="View public project page"
                        >
                          <Icon name="open_in_new" size="sm" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingProject(p)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete project"
                        >
                          <Icon name="delete" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Projects Presentation (Cards layout for small screens) */}
      <div className={`md:hidden space-y-3 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 font-mono text-xs space-y-2">
            <Icon name="folder_off" size="md" className="mx-auto text-stone-300" />
            <p className="font-medium text-stone-700">No projects found</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="text-stone-900 underline"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3"
            >
              {/* Card Header: Title & Statuses */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-stone-950 text-sm font-sans">
                      {p.title}
                    </h3>
                  </div>
                  <div className="font-mono text-[11px] text-stone-500 mt-0.5">
                    /{p.slug} • {p.category}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {p.status === 'published' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Published</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] bg-stone-100 text-stone-600 border border-stone-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                      <span>Draft</span>
                    </span>
                  )}
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-300">
                      <Icon name="star" size="sm" className="text-[11px] text-amber-600" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {p.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Meta: Last Updated */}
              <div className="text-[11px] font-mono text-stone-500 flex items-center justify-between pt-1 border-t border-stone-100">
                <span>Updated: {p.lastModified}</span>
                {p.githubUrl && <span className="text-stone-400">Git repo configured</span>}
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-stone-100 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(p)}
                  className="px-2 py-1.5 rounded border border-stone-200 text-stone-700 text-center hover:bg-stone-50"
                >
                  {p.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleFeatured(p)}
                  className={`px-2 py-1.5 rounded border text-center ${p.isFeatured
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                >
                  {p.isFeatured ? '★ Featured' : '☆ Feature'}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="px-2 py-1.5 rounded border border-stone-200 text-stone-700 text-center hover:bg-stone-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingProject(p)}
                  className="px-2 py-1.5 rounded border border-rose-200 text-rose-700 text-center hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE PROJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg w-full shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-stone-950">
                  Create Project
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Define project metadata and initial publication state
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <Icon name="close" size="md" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!formSlug) {
                      setFormSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Distributed Task Queue"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Slug Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. task-queue"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Publish Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProjectPublishStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the project and its purpose"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Category</label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Full-Stack Management System"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Express"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="create-featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <label htmlFor="create-featured" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Mark as featured project (highlighted on public overview)
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">GitHub Repository (optional)</label>
                  <input
                    type="url"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    value={formLive}
                    onChange={(e) => setFormLive(e.target.value)}
                    placeholder="https://demo..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg w-full shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-stone-950">
                  Edit Project: {editingProject.title}
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Modify attributes, publish status, or featured ranking
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <Icon name="close" size="md" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Slug Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Publish Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProjectPublishStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Unpublished)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the project and its purpose"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">Category</label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-800">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formTech}
                  onChange={(e) => setFormTech(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <label htmlFor="edit-featured" className="text-xs text-stone-700 font-medium cursor-pointer">
                  Mark as featured project (ASOCOMMS should appear as featured)
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">GitHub Repository (optional)</label>
                  <input
                    type="url"
                    value={formGithub}
                    onChange={(e) => setFormGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-800">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    value={formLive}
                    onChange={(e) => setFormLive(e.target.value)}
                    placeholder="https://demo..."
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Icon name="warning" size="md" />
              <h3 className="text-base font-bold font-display text-stone-950">
                Confirm Project Deletion
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Are you sure you want to delete <strong className="text-stone-900 font-semibold">{deletingProject.title}</strong>? This action will remove it from the projects list.
            </p>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2 text-xs font-mono">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingProject(null)}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

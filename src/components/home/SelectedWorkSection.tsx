import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FeaturedProjectCard } from '../projects/FeaturedProjectCard';
import { ProjectCard } from '../projects/ProjectCard';
import { Button } from '../ui/Button';
import { BrandLoader } from '../ui/BrandLoader';
import type { Project } from '../../types/project';

interface SelectedWorkSectionProps {
  onNavigate?: (path: string) => void;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  directoryView?: boolean;
}

export const SelectedWorkSection: React.FC<SelectedWorkSectionProps> = ({
  onNavigate,
  projects,
  isLoading,
  error,
  directoryView = false,
}) => {
  const flagshipProject = projects.find((project) => project.isFeatured) || projects[0];
  const secondaryProjects = projects.filter((project) => project.id !== flagshipProject?.id);

  if (isLoading || error || projects.length === 0) {
    return (
      <section className="py-16 sm:py-24 border-b border-stone-200/80 bg-[#FAFAF9]" id="selected-work">
        <Container size="default">
          <SectionHeading
            tag={directoryView ? 'PROJECT DIRECTORY' : 'SELECTED WORK'}
            title={directoryView ? 'All Engineering Projects' : 'Featured Engineering Projects'}
            description={
              directoryView
                ? 'Practical systems, tools, and technical experiments built with care.'
                : 'Practical applications built with an emphasis on maintainable architecture, structured state handling, and focused user workflows.'
            }
          />
          {isLoading ? (
            <BrandLoader label="Loading projects..." size="sm" className="mt-8 text-sm text-stone-600" />
          ) : (
            <p className="mt-8 text-sm text-stone-600" role={error ? 'alert' : 'status'}>
              {error || 'No published projects are available yet.'}
            </p>
          )}
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 border-b border-stone-200/80 bg-[#FAFAF9]" id="selected-work">
      <Container size="default">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12">
          <SectionHeading
            tag={directoryView ? 'PROJECT DIRECTORY' : 'SELECTED WORK'}
            title={directoryView ? 'All Engineering Projects' : 'Featured Engineering Projects'}
            description={
              directoryView
                ? 'Practical systems, tools, and technical experiments built with care.'
                : 'Practical applications built with an emphasis on maintainable architecture, structured state handling, and focused user workflows.'
            }
          />
          <div className="shrink-0">
            <span className="text-xs font-mono text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full">
              {projects.length} Projects Documented
            </span>
          </div>
        </div>

        {/* 1. Flagship Project: ASOCOMMS (Strong Visual Emphasis) */}
        <div className="mb-10 sm:mb-12">
          <FeaturedProjectCard project={flagshipProject} onNavigate={onNavigate} />
        </div>

        {/* Subheader for Secondary Projects */}
        <div className="pt-6 pb-6 flex items-center justify-between border-t border-stone-200">
          <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
            {directoryView ? 'More projects' : 'Additional Applications & Interfaces'}
          </h4>
          {!directoryView && (
            <span className="text-xs font-mono text-stone-400">
              Data • Productivity • Frontend
            </span>
          )}
        </div>

        {/* 2. Secondary Projects Grid: FinTrack, SwiftTask, Netflix Clone */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {secondaryProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        {!directoryView && <div className="mt-14 p-6 sm:p-8 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h4 className="font-display text-base sm:text-lg font-bold text-stone-900">
              Future Projects & Learning in Public
            </h4>
            <p className="text-sm text-stone-600 max-w-xl">
              New systems and engineering case studies are added as they are designed, implemented, and documented.
            </p>
          </div>
          <div className="w-full sm:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              size="md"
              rightIcon="arrow_forward"
              className="w-full sm:w-auto"
              onClick={() => onNavigate && onNavigate('/projects')}
            >
              Browse All Projects
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon="mail"
              className="w-full sm:w-auto"
              onClick={() => onNavigate && onNavigate('/contact')}
            >
              Get in Touch
            </Button>
          </div>
        </div>}
      </Container>
    </section>
  );
};

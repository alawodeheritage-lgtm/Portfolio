import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { FeaturedProjectCard } from '../projects/FeaturedProjectCard';
import { ProjectCard } from '../projects/ProjectCard';
import { SELECTED_PROJECTS } from '../../data/projects';
import { Button } from '../ui/Button';

interface SelectedWorkSectionProps {
  onNavigate?: (path: string) => void;
}

export const SelectedWorkSection: React.FC<SelectedWorkSectionProps> = ({
  onNavigate,
}) => {
  const flagshipProject = SELECTED_PROJECTS.find((p) => p.isFlagship) || SELECTED_PROJECTS[0];
  const secondaryProjects = SELECTED_PROJECTS.filter((p) => p.id !== flagshipProject.id);

  return (
    <section className="py-16 sm:py-24 border-b border-stone-200/80 bg-[#FAFAF9]" id="selected-work">
      <Container size="default">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12">
          <SectionHeading
            tag="SELECTED WORK"
            title="Featured Engineering Projects"
            description="Practical applications built with an emphasis on maintainable architecture, structured state handling, and focused user workflows."
          />
          <div className="shrink-0">
            <span className="text-xs font-mono text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full">
              4 Projects Documented
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
            Additional Applications & Interfaces
          </h4>
          <span className="text-xs font-mono text-stone-400">
            Data • Productivity • Frontend
          </span>
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
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <h4 className="font-display text-base sm:text-lg font-bold text-stone-900">
              Future Projects & Learning in Public
            </h4>
            <p className="text-sm text-stone-600 max-w-xl">
              New systems and engineering case studies are added as they are designed, implemented, and documented.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              rightIcon="arrow_forward"
              onClick={() => onNavigate && onNavigate('/projects')}
            >
              Browse All Projects
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon="mail"
              onClick={() => onNavigate && onNavigate('/contact')}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

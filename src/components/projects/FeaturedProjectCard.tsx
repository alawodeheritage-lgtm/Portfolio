import React from 'react';
import { Project } from '../../types/project';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface FeaturedProjectCardProps {
  project: Project;
  onNavigate?: (path: string) => void;
}

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  onNavigate,
}) => {
  const handleAction = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <article
      className="relative rounded-2xl border border-stone-300 bg-white p-6 sm:p-8 lg:p-10 shadow-xs hover:border-stone-400 transition-all duration-200"
      aria-labelledby={`featured-title-${project.id}`}
    >
      {/* Flagship Badge & Category Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-stone-900 text-stone-50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            MAJOR FEATURED WORK
          </span>
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            {project.category}
          </span>
        </div>

        {/* Primary Stack Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded text-xs font-mono text-stone-700 bg-stone-100 border border-stone-200/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Narrative & Details */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500">
              {project.tagline}
            </span>
            <h3
              id={`featured-title-${project.id}`}
              className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-stone-900 tracking-tight"
            >
              {project.title}
            </h3>
          </div>

          <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
            {project.description}
          </p>

          {/* Architectural & Feature Highlights */}
          {project.highlights && (
            <div className="space-y-3 pt-2">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-900">
                Core Architectural Highlights
              </h4>
              <ul className="space-y-2 text-sm text-stone-600">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Icon
                      name="check"
                      size="sm"
                      className="text-stone-900 mt-0.5 shrink-0"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
              variant="primary"
              size="md"
              rightIcon="arrow_forward"
              onClick={() => handleAction(project.caseStudyUrl)}
            >
              View Engineering Case Study
            </Button>
            {project.githubUrl && (
              <Button
                variant="outline"
                size="md"
                leftIcon="code"
                onClick={() => handleAction(project.caseStudyUrl)}
              >
                Inspect Code Architecture
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Structured System Architecture Blueprint */}
        <div className="lg:col-span-5 bg-stone-50 rounded-xl border border-stone-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs font-mono">
            <span className="text-stone-700 font-semibold flex items-center gap-1.5">
              <Icon name="terminal" size="sm" className="text-stone-500" />
              SYSTEM ARCHITECTURE
            </span>
            <span className="text-stone-400">MERN • REST</span>
          </div>

          {/* Architecture Blocks */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
              <div className="text-stone-500 uppercase tracking-wider text-[10px]">Client Layer</div>
              <div className="text-stone-900 font-semibold text-sm">React + TypeScript SPA</div>
              <div className="text-stone-600 text-[11px]">Strictly typed interfaces, order tracking view, technician diagnostics</div>
            </div>

            <div className="flex justify-center text-stone-400 py-0.5">
              <Icon name="swap_vert" size="sm" />
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
              <div className="text-stone-500 uppercase tracking-wider text-[10px]">API & Middleware</div>
              <div className="text-stone-900 font-semibold text-sm">Node.js + Express.js REST API</div>
              <div className="text-stone-600 text-[11px]">Work order routing, authentication, status transition validation</div>
            </div>

            <div className="flex justify-center text-stone-400 py-0.5">
              <Icon name="swap_vert" size="sm" />
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
              <div className="text-stone-500 uppercase tracking-wider text-[10px]">Persistence Layer</div>
              <div className="text-stone-900 font-semibold text-sm">MongoDB & Mongoose Models</div>
              <div className="text-stone-600 text-[11px]">WorkOrder, Customer, Technician, and Inventory schemas</div>
            </div>
          </div>

          {/* Direct verification badge */}
          <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5 border-t border-stone-200/80">
            <Icon name="lock" size="sm" className="text-stone-400 text-[14px]" />
            <span>Includes role-scoped technician review workflow</span>
          </div>
        </div>
      </div>
    </article>
  );
};

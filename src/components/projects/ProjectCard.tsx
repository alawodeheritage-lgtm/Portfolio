import React from 'react';
import { Project } from '../../types/project';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface ProjectCardProps {
  project: Project;
  onNavigate?: (path: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
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
      className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs hover:border-stone-300 transition-colors"
      aria-labelledby={`project-title-${project.id}`}
    >
      <div className="space-y-4">
        {/* Category & Status Indicator */}
        <div className="flex items-center justify-between gap-2 text-xs font-mono text-stone-500">
          <span className="uppercase tracking-wider">{project.category}</span>
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              Featured
            </span>
          )}
        </div>

        {/* Header */}
        <div>
          <h3
            id={`project-title-${project.id}`}
            className="text-xl font-bold font-display text-stone-900 tracking-tight"
          >
            {project.title}
          </h3>
          <p className="mt-1 text-xs font-mono text-stone-500">
            {project.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 leading-relaxed">
          {project.description}
        </p>

        {/* Feature Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <ul className="space-y-1.5 text-xs text-stone-600 pt-1">
            {project.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Icon
                  name="chevron_right"
                  size="sm"
                  className="text-stone-400 shrink-0 mt-0.5 text-[16px]"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer: Technologies & Action Button */}
      <div className="pt-6 mt-6 border-t border-stone-100 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[11px] font-mono text-stone-700 bg-stone-100 border border-stone-200/60"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            rightIcon="arrow_forward"
            onClick={() => handleAction(project.caseStudyUrl)}
            className="w-full sm:w-auto"
          >
            View Project Case Study
          </Button>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              onClick={(e) => {
                e.preventDefault();
                handleAction(project.caseStudyUrl);
              }}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              title="View repository"
              aria-label={`View code for ${project.title}`}
            >
              <Icon name="code" size="md" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

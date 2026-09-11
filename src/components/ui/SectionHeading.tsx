import React from 'react';

export interface SectionHeadingProps {
  tag?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  description,
  align = 'left',
  className = '',
}) => {
  const alignmentClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignmentClass} ${className}`}>
      {tag && (
        <span className="font-mono text-xs font-semibold tracking-wider text-stone-500 uppercase mb-2">
          {tag}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display">
        {title}
      </h2>
      {description && (
        <p className="mt-2.5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

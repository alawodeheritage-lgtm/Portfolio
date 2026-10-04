import React from 'react';

export interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'lightSurface' | 'darkSurface';
  animatedAccent?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<BrandMarkProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
};

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 'md',
  tone = 'lightSurface',
  animatedAccent = false,
  className = '',
}) => {
  const markColor = tone === 'darkSurface' ? 'text-stone-100' : 'text-stone-800';
  const accentColor = tone === 'darkSurface' ? 'text-amber-400' : 'text-amber-600';

  return (
    <svg
      className={`${sizeClasses[size]} shrink-0 ${className}`}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 5v18M21 5v18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={markColor}
      />
      <path
        d="M7 14h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={animatedAccent ? '14' : undefined}
        className={`${accentColor} ${animatedAccent ? 'brand-loader-trace' : ''}`}
      />
    </svg>
  );
};
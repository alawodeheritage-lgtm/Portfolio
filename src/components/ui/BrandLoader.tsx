import React from 'react';
import { BrandMark } from './BrandMark';

export interface BrandLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'lightSurface' | 'darkSurface';
  className?: string;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  label,
  size = 'md',
  tone = 'lightSurface',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center ${className}`}
      role="status"
      aria-label={label || 'Loading'}
    >
      <BrandMark size={size} tone={tone} animatedAccent />
    </span>
  );
};
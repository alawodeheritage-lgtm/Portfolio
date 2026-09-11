import React from 'react';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | number;

interface IconProps {
  name: string;
  className?: string;
  size?: IconSize;
  filled?: boolean;
  ariaLabel?: string;
  ariaHidden?: boolean;
}

const sizeMap: Record<string, string> = {
  sm: 'text-[18px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[28px]',
};

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  size = 'md',
  filled = false,
  ariaLabel,
  ariaHidden = true,
}) => {
  const sizeClass = typeof size === 'number' ? '' : (sizeMap[size] || 'text-[20px]');
  const customStyle = typeof size === 'number' ? { fontSize: `${size}px` } : undefined;

  return (
    <span
      className={`material-symbols-outlined select-none align-middle leading-none ${sizeClass} ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...customStyle,
      }}
      aria-hidden={ariaLabel ? false : ariaHidden}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {name}
    </span>
  );
};

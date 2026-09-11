import React from 'react';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: string;
  rightIcon?: string;
  isLoading?: boolean;
  href?: string;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-stone-900 text-stone-50 hover:bg-stone-800 active:bg-stone-950 border border-stone-900 shadow-sm',
  secondary:
    'bg-stone-100 text-stone-900 hover:bg-stone-200 active:bg-stone-300 border border-stone-200',
  outline:
    'bg-transparent text-stone-900 hover:bg-stone-100 active:bg-stone-200 border border-stone-300',
  ghost:
    'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 border border-transparent',
  link:
    'bg-transparent text-stone-900 hover:underline active:text-stone-700 p-0 border-none font-medium h-auto shadow-none',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs py-1.5 px-3 gap-1.5 rounded-md font-medium',
  md: 'text-sm py-2 px-4 gap-2 rounded-lg font-medium',
  lg: 'text-base py-2.5 px-5 gap-2.5 rounded-lg font-medium',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  href,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center transition-colors duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${variant === 'link' ? '' : sizeClasses[size]} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : leftIcon ? (
        <Icon name={leftIcon} size={size === 'sm' ? 'sm' : 'md'} />
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <Icon name={rightIcon} size={size === 'sm' ? 'sm' : 'md'} />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={combinedClasses} role="button">
        {content}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};

import { HTMLAttributes, ReactNode } from 'react';

interface PABadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  children: ReactNode;
  className?: string;
}

export default function PABadge({ 
  variant = 'primary',
  children,
  className = '',
  ...props 
}: PABadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded text-xs font-medium transition-colors';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-accent text-primary',
    success: 'bg-green-500 text-white dark:bg-green-600',
    warning: 'bg-yellow-500 text-gray-900 dark:bg-yellow-600 dark:text-gray-900',
    error: 'bg-destructive text-destructive-foreground',
    neutral: 'bg-muted text-muted-foreground'
  };

  return (
    <span 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
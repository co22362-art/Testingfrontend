import { ReactNode, HTMLAttributes } from 'react';

type Variant = 'default' | 'elevated' | 'floating' | 'selected' | 'glass';

interface PACardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export default function PACard({ 
  variant = 'default',
  children,
  className = '',
  ...props 
}: PACardProps) {
  const baseStyles = 'bg-card text-card-foreground rounded-lg transition-all duration-200';
  
  const variantStyles: Record<Variant, string> = {
    default: 'border border-border',
    elevated: 'border border-border shadow-sm hover:shadow-md',
    floating: 'shadow-md border border-border',
    selected: 'border-2 border-primary shadow-sm',
    glass: 'border border-border backdrop-blur-sm'
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
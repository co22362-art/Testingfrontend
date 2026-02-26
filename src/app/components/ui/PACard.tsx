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
  const baseStyles = 'bg-white rounded-lg transition-all duration-200';
  
  const variantStyles: Record<Variant, string> = {
    default: 'border border-[#E5E7EB]',
    elevated: 'border border-[#E5E7EB] shadow-sm hover:shadow-md',
    floating: 'shadow-md border border-[#E5E7EB]',
    selected: 'border-2 border-[#1976D2] shadow-sm',
    glass: 'border border-[#E5E7EB] backdrop-blur-sm'
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

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  children: ReactNode;
  className?: string;
}

export default function PAButton({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: PAButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 active:opacity-80',
    secondary: 'bg-transparent border-2 border-primary text-primary hover:bg-accent active:bg-accent/80',
    text: 'bg-transparent text-primary hover:underline active:opacity-80 px-0'
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
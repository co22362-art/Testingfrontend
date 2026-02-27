import { forwardRef, InputHTMLAttributes } from 'react';

interface PAInputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: 'default' | 'active' | 'error';
  className?: string;
}

const PAInput = forwardRef<HTMLInputElement, PAInputProps>(({ 
  state = 'default', 
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none';
  
  const stateStyles = {
    default: 'border-border bg-input-background text-foreground hover:border-border/60 focus:border-primary focus:ring-2 focus:ring-ring/20',
    active: 'border-primary bg-input-background text-foreground ring-2 ring-ring/20',
    error: 'border-destructive bg-destructive/10 text-foreground focus:ring-2 focus:ring-destructive/20'
  };

  return (
    <input
      ref={ref}
      className={`${baseStyles} ${stateStyles[state]} ${className}`}
      {...props}
    />
  );
});

PAInput.displayName = 'PAInput';

export default PAInput;
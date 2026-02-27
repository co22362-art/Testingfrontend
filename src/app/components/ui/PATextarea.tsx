import { TextareaHTMLAttributes } from 'react';

interface PATextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: 'default' | 'focused';
  focusColor?: string;
  label?: string;
  helperText?: string;
  className?: string;
}

export default function PATextarea({ 
  state = 'default',
  focusColor = '#1976D2',
  label,
  helperText,
  className = '',
  ...props 
}: PATextareaProps) {
  const baseStyles = 'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none resize-none bg-input-background text-foreground';
  
  const getStateStyles = () => {
    if (state === 'focused') {
      return `border-primary ring-2 ring-opacity-20`;
    }
    return 'border-border focus:border-primary focus:ring-2 focus:ring-ring focus:ring-opacity-20';
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-foreground mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`${baseStyles} ${getStateStyles()} ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-xs italic text-muted-foreground mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
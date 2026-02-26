import { forwardRef } from 'react';

const PAInput = forwardRef(({ 
  state = 'default', 
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none';
  
  const stateStyles = {
    default: 'border-[#E0E0E0] bg-white hover:border-[#9E9E9E] focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20',
    active: 'border-[#1976D2] bg-white ring-2 ring-[#1976D2]/20',
    error: 'border-[#D32F2F] bg-[#FFEBEE] focus:ring-2 focus:ring-[#D32F2F]/20'
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

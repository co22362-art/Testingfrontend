export default function PABadge({ 
  variant = 'primary',
  children,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded text-xs font-medium transition-colors';
  
  const variantStyles = {
    primary: 'bg-[#1976D2] text-white',
    secondary: 'bg-[#E3F2FD] text-[#1976D2]',
    success: 'bg-[#4CAF50] text-white',
    warning: 'bg-[#FFC107] text-gray-900',
    error: 'bg-[#D32F2F] text-white',
    neutral: 'bg-[#E0E0E0] text-gray-700'
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

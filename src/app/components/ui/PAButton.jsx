export default function PAButton({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) {
  const baseStyles = 'px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#1976D2] text-white hover:bg-[#1565C0] active:bg-[#0D47A1]',
    secondary: 'bg-transparent border-2 border-[#1976D2] text-[#1976D2] hover:bg-[#E3F2FD] active:bg-[#BBDEFB]',
    text: 'bg-transparent text-[#1976D2] hover:underline active:text-[#1565C0] px-0'
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

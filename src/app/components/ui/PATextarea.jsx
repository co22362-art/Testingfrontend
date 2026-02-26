export default function PATextarea({ 
  state = 'default',
  focusColor = '#1976D2',
  label,
  helperText,
  className = '',
  ...props 
}) {
  const baseStyles = 'w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none resize-none';
  
  const getStateStyles = () => {
    if (state === 'focused') {
      return `border-[${focusColor}] ring-2 ring-opacity-20`;
    }
    return 'border-gray-300 focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2] focus:ring-opacity-20';
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`${baseStyles} ${getStateStyles()} ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-xs italic text-gray-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}

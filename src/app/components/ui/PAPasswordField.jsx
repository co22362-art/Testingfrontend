import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PAInput from './PAInput';

const PAPasswordField = forwardRef(({ 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <PAInput
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        state={error ? 'error' : 'default'}
        className={`pr-12 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#424242] transition-colors"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
});

PAPasswordField.displayName = 'PAPasswordField';

export default PAPasswordField;

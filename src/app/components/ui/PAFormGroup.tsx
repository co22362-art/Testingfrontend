import { InputHTMLAttributes } from 'react';
import PAInput from './PAInput';

interface PAFormGroupProps {
  label: string;
  error?: string;
  required?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export default function PAFormGroup({ label, error, required, inputProps = {} }: PAFormGroupProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <PAInput 
        state={error ? 'error' : 'default'}
        {...inputProps}
      />
      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  );
}
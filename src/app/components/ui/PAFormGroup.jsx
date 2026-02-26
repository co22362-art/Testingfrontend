import PAInput from './PAInput';

export default function PAFormGroup({ label, error, required, inputProps = {} }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-[#424242]">
        {label}
        {required && <span className="text-[#D32F2F] ml-1">*</span>}
      </label>
      <PAInput 
        state={error ? 'error' : 'default'}
        {...inputProps}
      />
      {error && (
        <span className="text-sm text-[#D32F2F]">{error}</span>
      )}
    </div>
  );
}

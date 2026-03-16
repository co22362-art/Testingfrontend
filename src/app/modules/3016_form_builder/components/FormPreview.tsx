import { useState } from 'react';
import { ArrowLeft, Edit3, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import { Form, FormField } from '../FormBuilderPage';

interface FormPreviewProps {
  form: Form;
  onBack: () => void;
  onEdit: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export default function FormPreview({ 
  form, 
  onBack, 
  onEdit, 
  isMobilePreview, 
  onToggleMobilePreview 
}: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = form.fields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields:\n${missingFields.join(', ')}`);
      return;
    }

    setSubmitted(true);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-all"
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-primary/10"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => {
              const checkedValues = (value || []) as string[];
              return (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={checkedValues.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...checkedValues, option]
                        : checkedValues.filter(v => v !== option);
                      handleFieldChange(field.id, newValues);
                    }}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/10"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {option}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        );

      case 'file':
        return (
          <input
            type="file"
            id={field.id}
            onChange={(e) => handleFieldChange(field.id, e.target.files?.[0])}
            required={field.required}
            className="w-full h-10 px-3 bg-card border border-border rounded-lg text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="h-9 px-3 md:px-4 border border-border hover:bg-accent rounded-lg text-sm font-medium text-foreground flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Forms
            </button>
          </div>
        </header>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Form Submitted Successfully!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This is a preview. In the live form, responses would be saved to your database.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="h-10 px-6 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="h-9 w-9 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-semibold text-foreground">
                Preview: {form.name}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                This is how your form will appear to users
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-accent rounded-lg">
              <button
                onClick={() => !isMobilePreview && onToggleMobilePreview()}
                className={`h-8 px-3 rounded flex items-center gap-2 text-sm font-medium transition-colors ${
                  !isMobilePreview
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
              <button
                onClick={() => isMobilePreview && onToggleMobilePreview()}
                className={`h-8 px-3 rounded flex items-center gap-2 text-sm font-medium transition-colors ${
                  isMobilePreview
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
            </div>

            <button
              onClick={onEdit}
              className="h-9 px-3 md:px-4 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Form</span>
            </button>
          </div>
        </div>
      </header>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto bg-accent/30 flex items-start justify-center p-4 md:p-8">
        <div
          className={`bg-card border border-border rounded-lg shadow-lg transition-all ${
            isMobilePreview ? 'w-full max-w-md' : 'w-full max-w-3xl'
          }`}
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Form Header */}
            <div className="mb-6 md:mb-8 pb-6 border-b border-border">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                {form.name}
              </h2>
              {form.description && (
                <p className="text-sm text-muted-foreground">
                  {form.description}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4 md:space-y-6">
              {form.fields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No fields added yet. Click "Edit Form" to add fields.
                  </p>
                </div>
              ) : (
                form.fields.map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-primary ml-1">*</span>
                      )}
                    </label>
                    {renderField(field)}
                  </div>
                ))
              )}
            </div>

            {/* Submit Button */}
            {form.fields.length > 0 && (
              <div className="mt-6 md:mt-8 pt-6 border-t border-border">
                <button
                  type="submit"
                  className="w-full md:w-auto h-11 px-8 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  Submit Form
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

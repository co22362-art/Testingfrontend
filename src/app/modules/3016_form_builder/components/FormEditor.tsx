import { useState } from 'react';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Save,
  Send,
  Type,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  Circle,
  CheckSquare,
  Calendar as CalendarIcon,
  Upload,
  Copy,
  ChevronRight,
  MoreVertical,
  X,
  Undo,
  Redo,
  Clock,
  Minus,
  Settings,
  Palette,
  FileCode,
  Sparkles,
  LayoutGrid,
  Database,
  Layers,
  Image as ImageIcon,
  Link2,
  Zap
} from 'lucide-react';
import { Form, FormField } from '../FormBuilderPage';

interface FormEditorProps {
  form: Form;
  onSave: (form: Form) => void;
  onBack: () => void;
  onPreview: () => void;
  onPublish: (form: Form) => void;
}

const fieldTypeCategories = {
  standard: [
    { value: 'text', label: 'Short Answer', icon: Type, description: 'Single line text input' },
    { value: 'textarea', label: 'Paragraph', icon: AlignLeft, description: 'Multi-line text area' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Email address field' },
    { value: 'number', label: 'Number', icon: Hash, description: 'Numeric input field' },
  ],
  advanced: [
    { value: 'select', label: 'Dropdown', icon: ChevronDown, description: 'Select from dropdown' },
    { value: 'radio', label: 'Multiple Choice', icon: Circle, description: 'Choose one option' },
    { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Select multiple options' },
    { value: 'date', label: 'Date', icon: CalendarIcon, description: 'Date picker field' },
    { value: 'file', label: 'File Upload', icon: Upload, description: 'Upload file attachment' },
  ],
  layout: [
    { value: 'pagebreak', label: 'Page Break', icon: Minus, description: 'Split into multiple pages' },
  ],
  data: [
    { value: 'synced', label: 'Synced Field', icon: Database, description: 'Link to external data' },
  ]
};

type EditorMode = 'build' | 'design' | 'settings';
type InspectorTab = 'content' | 'logic' | 'advanced';

export default function FormEditor({ form, onSave, onBack, onPreview, onPublish }: FormEditorProps) {
  const [editedForm, setEditedForm] = useState<Form>(form);
  const [hasChanges, setHasChanges] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>('build');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('content');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['standard', 'advanced']);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isFieldLibraryOpen, setIsFieldLibraryOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);

  // Theme state
  const [theme, setTheme] = useState({
    primaryColor: '#1976D2',
    fontFamily: 'Inter',
    headingSize: 24,
    bodySize: 14,
    borderRadius: 8
  });

  const handleFormNameChange = (name: string) => {
    setEditedForm({ ...editedForm, name });
    setHasChanges(true);
  };

  const handleFormDescriptionChange = (description: string) => {
    setEditedForm({ ...editedForm, description });
    setHasChanges(true);
  };

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: '',
      required: false,
      ...(type === 'select' || type === 'radio' || type === 'checkbox' ? { options: ['Option 1'] } : {})
    };
    
    setEditedForm({
      ...editedForm,
      fields: [...editedForm.fields, newField]
    });
    setFocusedField(newField.id);
    setHasChanges(true);
  };

  const handleDuplicateField = (fieldId: string) => {
    const field = editedForm.fields.find(f => f.id === fieldId);
    if (!field) return;

    const duplicatedField: FormField = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (copy)`
    };

    const index = editedForm.fields.findIndex(f => f.id === fieldId);
    const newFields = [...editedForm.fields];
    newFields.splice(index + 1, 0, duplicatedField);

    setEditedForm({ ...editedForm, fields: newFields });
    setHasChanges(true);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setEditedForm({
      ...editedForm,
      fields: editedForm.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    });
    setHasChanges(true);
  };

  const handleDeleteField = (fieldId: string) => {
    setEditedForm({
      ...editedForm,
      fields: editedForm.fields.filter(f => f.id !== fieldId)
    });
    if (focusedField === fieldId) {
      setFocusedField(null);
    }
    setHasChanges(true);
  };

  const handleAddOption = (fieldId: string) => {
    const field = editedForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    handleUpdateField(fieldId, {
      options: [...field.options, `Option ${field.options.length + 1}`]
    });
  };

  const handleUpdateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = editedForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    handleUpdateField(fieldId, { options: newOptions });
  };

  const handleDeleteOption = (fieldId: string, optionIndex: number) => {
    const field = editedForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options || field.options.length <= 1) return;

    handleUpdateField(fieldId, {
      options: field.options.filter((_, i) => i !== optionIndex)
    });
  };

  const handleSave = () => {
    const updated = {
      ...editedForm,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onSave(updated);
    setHasChanges(false);
    setLastSaved(new Date());
  };

  const handlePublish = () => {
    handleSave();
    onPublish(editedForm);
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', fieldId);
  };

  const handleDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedFieldId !== fieldId) {
      setDragOverFieldId(fieldId);
    }
  };

  const handleDragLeave = () => {
    setDragOverFieldId(null);
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    
    if (!draggedFieldId || draggedFieldId === targetFieldId) {
      setDraggedFieldId(null);
      setDragOverFieldId(null);
      return;
    }

    const draggedIndex = editedForm.fields.findIndex(f => f.id === draggedFieldId);
    const targetIndex = editedForm.fields.findIndex(f => f.id === targetFieldId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newFields = [...editedForm.fields];
    const [draggedField] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedField);

    setEditedForm({ ...editedForm, fields: newFields });
    setHasChanges(true);
    setDraggedFieldId(null);
    setDragOverFieldId(null);
  };

  const handleDragEnd = () => {
    setDraggedFieldId(null);
    setDragOverFieldId(null);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getFocusedField = () => {
    return editedForm.fields.find(f => f.id === focusedField);
  };

  const allFieldTypes = [...fieldTypeCategories.standard, ...fieldTypeCategories.advanced];

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <header className="bg-card border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
              title="Back to list"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            
            <div className="flex items-center gap-2">
              <button
                className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors disabled:opacity-40"
                title="Undo"
                disabled
              >
                <Undo className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors disabled:opacity-40"
                title="Redo"
                disabled
              >
                <Redo className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
              <Clock className="w-3 h-3" />
              <span>Last saved at {lastSaved.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Center Section - Mode Toggle */}
          <div className="flex items-center gap-1 bg-accent/50 p-1 rounded-lg">
            <button
              onClick={() => setMode('build')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                mode === 'build'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setMode('design')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                mode === 'design'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setMode('settings')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                mode === 'settings'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPreview}
              className="h-9 px-4 border border-border hover:bg-accent rounded-lg text-sm font-medium text-foreground flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline">Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="h-9 px-4 border border-border hover:bg-accent rounded-lg text-sm font-medium text-foreground flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span className="hidden md:inline">Save</span>
            </button>
            <button
              onClick={handlePublish}
              className="h-9 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Three-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Library - Desktop Only */}
        {mode === 'build' && (
          <div className="hidden lg:block w-64 bg-card border-r border-border flex-shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground mb-1">Field Library</h3>
              <p className="text-xs text-muted-foreground">Drag or click to add</p>
            </div>

            {/* Standard Fields */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleCategory('standard')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Standard</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedCategories.includes('standard') ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedCategories.includes('standard') && (
                <div className="px-2 pb-2 space-y-1">
                  {fieldTypeCategories.standard.map(field => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.value}
                        onClick={() => handleAddField(field.value as FormField['type'])}
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-foreground">{field.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Advanced Fields */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleCategory('advanced')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Advanced</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedCategories.includes('advanced') ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedCategories.includes('advanced') && (
                <div className="px-2 pb-2 space-y-1">
                  {fieldTypeCategories.advanced.map(field => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.value}
                        onClick={() => handleAddField(field.value as FormField['type'])}
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-foreground">{field.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Layout */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleCategory('layout')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Layout</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedCategories.includes('layout') ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedCategories.includes('layout') && (
                <div className="px-2 pb-2 space-y-1">
                  {fieldTypeCategories.layout.map(field => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.value}
                        onClick={() => {}}
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-foreground">{field.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Data */}
            <div>
              <button
                onClick={() => toggleCategory('data')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Data</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expandedCategories.includes('data') ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedCategories.includes('data') && (
                <div className="px-2 pb-2 space-y-1">
                  {fieldTypeCategories.data.map(field => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.value}
                        onClick={() => {}}
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-accent transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-foreground">{field.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#F5F7FA] dark:bg-background">
          {mode === 'build' && (
            <div className="max-w-3xl mx-auto py-8 px-6">
              {/* Form Header */}
              <div className="bg-white dark:bg-card rounded-lg border border-[#E5E7EB] dark:border-border mb-6 p-6">
                <input
                  type="text"
                  value={editedForm.name}
                  onChange={(e) => handleFormNameChange(e.target.value)}
                  className="w-full text-2xl font-semibold text-foreground bg-transparent border-none outline-none mb-2"
                  placeholder="Untitled form"
                />
                <textarea
                  value={editedForm.description}
                  onChange={(e) => handleFormDescriptionChange(e.target.value)}
                  placeholder="Form description"
                  className="w-full text-sm text-muted-foreground bg-transparent border-none outline-none resize-none"
                  rows={2}
                />
              </div>

              {/* Question Cards */}
              {editedForm.fields.map((field, index) => {
                const isFocused = focusedField === field.id;
                const isDragging = draggedFieldId === field.id;
                const isDragOver = dragOverFieldId === field.id;
                const FieldIcon = allFieldTypes.find(t => t.value === field.type)?.icon || Type;

                return (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    onDragOver={(e) => handleDragOver(e, field.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setFocusedField(field.id)}
                    className={`bg-white dark:bg-card rounded-lg border mb-4 transition-all cursor-pointer group ${
                      isDragging 
                        ? 'opacity-50 scale-95'
                        : isDragOver
                        ? 'border-primary shadow-lg ring-2 ring-primary/40'
                        : isFocused
                        ? 'border-primary shadow-md ring-2 ring-primary/20'
                        : 'border-[#E5E7EB] dark:border-border hover:border-[#D1D5DB] dark:hover:border-border/60'
                    }`}
                  >
                    {/* Left Border for Hierarchy */}
                    <div className="flex">
                      <div className={`w-1 rounded-l-lg ${isFocused ? 'bg-primary' : 'bg-transparent'}`} />
                      
                      <div className="flex-1 p-5">
                        {/* Field Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <button 
                            onMouseDown={(e) => e.stopPropagation()}
                            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>

                          <div className="flex-1">
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                              className="w-full text-base font-medium text-foreground bg-transparent border-none outline-none mb-2"
                              placeholder="Question"
                            />

                            {/* Field Preview */}
                            {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
                              <div className="text-sm text-muted-foreground border-b border-dashed border-border pb-1">
                                {field.placeholder || 'Short answer text'}
                              </div>
                            )}

                            {field.type === 'textarea' && (
                              <div className="text-sm text-muted-foreground border border-dashed border-border rounded p-2">
                                Long answer text
                              </div>
                            )}

                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && field.options && (
                              <div className="space-y-2 mt-2">
                                {field.options.slice(0, 2).map((option, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className={`w-3 h-3 border-2 border-muted-foreground ${
                                      field.type === 'checkbox' ? 'rounded' : 'rounded-full'
                                    }`} />
                                    {option}
                                  </div>
                                ))}
                                {field.options.length > 2 && (
                                  <div className="text-xs text-muted-foreground pl-5">
                                    +{field.options.length - 2} more options
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Hover Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateField(field.id);
                              }}
                              className="h-8 w-8 rounded hover:bg-accent flex items-center justify-center transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteField(field.id);
                              }}
                              className="h-8 w-8 rounded hover:bg-accent flex items-center justify-center transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Field Prompt */}
              {editedForm.fields.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Start building your form</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    <span className="hidden lg:inline">Click on a field type from the left sidebar to add it to your form</span>
                    <span className="lg:hidden">Tap the + button to add fields to your form</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Design Mode */}
          {mode === 'design' && (
            <div className="max-w-3xl mx-auto py-8 px-6">
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <Palette className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Theme Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your form's appearance using the panel on the right
                </p>
              </div>
            </div>
          )}

          {/* Settings Mode */}
          {mode === 'settings' && (
            <div className="max-w-3xl mx-auto py-8 px-6">
              <div className="bg-card rounded-lg border border-border p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Form Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      After Submission
                    </label>
                    <select className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Show thank you message</option>
                      <option>Redirect to URL</option>
                      <option>Show custom message</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Thank You Message
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={3}
                      placeholder="Thank you for your submission!"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Allow Multiple Submissions</div>
                      <div className="text-xs text-muted-foreground">Users can submit the form multiple times</div>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-primary">
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Inspector / Theme Editor - Desktop Only */}
        {mode === 'build' && focusedField && getFocusedField() && (
          <div className="hidden lg:block w-80 bg-card border-l border-border flex-shrink-0 overflow-y-auto">
            {/* Inspector Tabs */}
            <div className="border-b border-border flex">
              <button
                onClick={() => setInspectorTab('content')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  inspectorTab === 'content'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setInspectorTab('logic')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  inspectorTab === 'logic'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Logic
              </button>
              <button
                onClick={() => setInspectorTab('advanced')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  inspectorTab === 'advanced'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Advanced
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Content Tab */}
              {inspectorTab === 'content' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={getFocusedField()?.label || ''}
                      onChange={(e) => handleUpdateField(focusedField, { label: e.target.value })}
                      className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter question"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={getFocusedField()?.placeholder || ''}
                      onChange={(e) => handleUpdateField(focusedField, { placeholder: e.target.value })}
                      className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  {/* Options for select/radio/checkbox */}
                  {(getFocusedField()?.type === 'select' || 
                    getFocusedField()?.type === 'radio' || 
                    getFocusedField()?.type === 'checkbox') && (
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {getFocusedField()?.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleUpdateOption(focusedField, idx, e.target.value)}
                              className="flex-1 h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {getFocusedField()?.options && getFocusedField()!.options!.length > 1 && (
                              <button
                                onClick={() => handleDeleteOption(focusedField, idx)}
                                className="h-9 w-9 rounded hover:bg-accent flex items-center justify-center"
                              >
                                <X className="w-4 h-4 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddOption(focusedField)}
                          className="w-full h-9 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">Required</div>
                      <div className="text-xs text-muted-foreground">Make this field mandatory</div>
                    </div>
                    <button
                      onClick={() => handleUpdateField(focusedField, { required: !getFocusedField()?.required })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        getFocusedField()?.required ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          getFocusedField()?.required ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Rich Text */}
                  <div className="pt-4 border-t border-border">
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      <ImageIcon className="w-3 h-3 inline mr-1" />
                      Media
                    </label>
                    <button className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent/50 transition-colors">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add image or video</span>
                    </button>
                  </div>
                </>
              )}

              {/* Logic Tab */}
              {inspectorTab === 'logic' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      <Zap className="w-3 h-3 inline mr-1" />
                      Conditional Visibility
                    </label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Show this field only when certain conditions are met
                    </p>
                    <button className="w-full h-9 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors">
                      + Add Condition
                    </button>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Skip Logic
                    </label>
                    <select className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>No skip logic</option>
                      <option>Skip to next section</option>
                      <option>Skip to specific field</option>
                    </select>
                  </div>
                </>
              )}

              {/* Advanced Tab */}
              {inspectorTab === 'advanced' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Validation Rules
                    </label>
                    <select className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 mb-2">
                      <option>No validation</option>
                      <option>Email format</option>
                      <option>Phone number</option>
                      <option>URL</option>
                      <option>Custom regex</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Custom validation message"
                      className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Field ID
                    </label>
                    <input
                      type="text"
                      value={getFocusedField()?.id || ''}
                      disabled
                      className="w-full h-9 px-3 bg-accent border border-border rounded-lg text-sm text-muted-foreground font-mono"
                    />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      <FileCode className="w-3 h-3 inline mr-1" />
                      Custom CSS Classes
                    </label>
                    <div className="bg-[#1E1E1E] rounded-lg p-3 font-mono text-xs text-[#D4D4D4]">
                      <div className="text-[#6A9955]">/* Add custom CSS classes */</div>
                      <input
                        type="text"
                        placeholder=".custom-class"
                        className="w-full bg-transparent border-none outline-none text-[#9CDCFE] mt-1"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Design Mode - Theme Editor */}
        {mode === 'design' && (
          <div className="w-80 bg-card border-l border-border flex-shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground mb-1">Global Theme</h3>
              <p className="text-xs text-muted-foreground">Customize your form's appearance</p>
            </div>

            <div className="p-4 space-y-6">
              {/* Colors */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Colors
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Primary Color</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="w-24 h-8 px-2 bg-background border border-border rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="pt-4 border-t border-border">
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Typography
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Font Family</label>
                    <select
                      value={theme.fontFamily}
                      onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                      className="w-full h-9 px-3 bg-background border border-border rounded-lg text-sm"
                    >
                      <option value="Inter" style={{ fontFamily: 'Inter' }}>Inter</option>
                      <option value="Roboto" style={{ fontFamily: 'Roboto' }}>Roboto</option>
                      <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                      <option value="system-ui" style={{ fontFamily: 'system-ui' }}>System UI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Heading Size: {theme.headingSize}px
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="32"
                      value={theme.headingSize}
                      onChange={(e) => setTheme({ ...theme, headingSize: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Body Size: {theme.bodySize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      value={theme.bodySize}
                      onChange={(e) => setTheme({ ...theme, bodySize: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div className="pt-4 border-t border-border">
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Spacing
                </label>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Border Radius: {theme.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={theme.borderRadius}
                    onChange={(e) => setTheme({ ...theme, borderRadius: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile FAB - Add Field Button */}
      {mode === 'build' && (
        <button
          onClick={() => setIsFieldLibraryOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-transform active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Field Library Drawer */}
      {isFieldLibraryOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsFieldLibraryOpen(false)}
          />

          {/* Bottom Drawer */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Add Field</h3>
              <button
                onClick={() => setIsFieldLibraryOpen(false)}
                className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
              {/* Standard Fields */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Standard</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fieldTypeCategories.standard.map(field => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.value}
                        onClick={() => {
                          handleAddField(field.value as FormField['type']);
                          setIsFieldLibraryOpen(false);
                        }}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground text-center">{field.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Fields */}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Advanced</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-4">
                  {fieldTypeCategories.advanced.map(field => {
                    const Icon = field.icon;
                    return (
                      <button
                        key={field.value}
                        onClick={() => {
                          handleAddField(field.value as FormField['type']);
                          setIsFieldLibraryOpen(false);
                        }}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground text-center">{field.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Inspector Button */}
      {mode === 'build' && focusedField && getFocusedField() && (
        <button
          onClick={() => setIsInspectorOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 px-4 h-12 bg-card border border-border text-foreground rounded-full shadow-lg flex items-center gap-2 z-40 transition-transform active:scale-95"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Edit Field</span>
        </button>
      )}

      {/* Mobile Inspector Drawer */}
      {isInspectorOpen && focusedField && getFocusedField() && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsInspectorOpen(false)}
          />

          {/* Bottom Drawer */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-hidden">
            <div className="sticky top-0 bg-card border-b border-border">
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Field Settings</h3>
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-t border-border">
                <button
                  onClick={() => setInspectorTab('content')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    inspectorTab === 'content'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setInspectorTab('logic')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    inspectorTab === 'logic'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Logic
                </button>
                <button
                  onClick={() => setInspectorTab('advanced')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    inspectorTab === 'advanced'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-4 space-y-4">
              {/* Content Tab */}
              {inspectorTab === 'content' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={getFocusedField()?.label || ''}
                      onChange={(e) => handleUpdateField(focusedField, { label: e.target.value })}
                      className="w-full h-11 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter question"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={getFocusedField()?.placeholder || ''}
                      onChange={(e) => handleUpdateField(focusedField, { placeholder: e.target.value })}
                      className="w-full h-11 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  {/* Options for select/radio/checkbox */}
                  {(getFocusedField()?.type === 'select' || 
                    getFocusedField()?.type === 'radio' || 
                    getFocusedField()?.type === 'checkbox') && (
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {getFocusedField()?.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleUpdateOption(focusedField, idx, e.target.value)}
                              className="flex-1 h-11 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {getFocusedField()?.options && getFocusedField()!.options!.length > 1 && (
                              <button
                                onClick={() => handleDeleteOption(focusedField, idx)}
                                className="h-11 w-11 rounded-lg hover:bg-accent flex items-center justify-center"
                              >
                                <X className="w-5 h-5 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddOption(focusedField)}
                          className="w-full h-11 border border-dashed border-border rounded-lg text-sm text-muted-foreground active:bg-accent transition-colors"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-3 border-t border-border">
                    <div>
                      <div className="text-sm font-medium text-foreground">Required</div>
                      <div className="text-xs text-muted-foreground">Make this field mandatory</div>
                    </div>
                    <button
                      onClick={() => handleUpdateField(focusedField, { required: !getFocusedField()?.required })}
                      className={`relative w-12 h-7 rounded-full transition-colors ${
                        getFocusedField()?.required ? 'bg-primary' : 'bg-border'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          getFocusedField()?.required ? 'left-[26px]' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* Logic Tab */}
              {inspectorTab === 'logic' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      <Zap className="w-3 h-3 inline mr-1" />
                      Conditional Visibility
                    </label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Show this field only when certain conditions are met
                    </p>
                    <button className="w-full h-11 border border-border rounded-lg text-sm text-foreground active:bg-accent transition-colors">
                      + Add Condition
                    </button>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Skip Logic
                    </label>
                    <select className="w-full h-11 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>No skip logic</option>
                      <option>Skip to next section</option>
                      <option>Skip to specific field</option>
                    </select>
                  </div>
                </>
              )}

              {/* Advanced Tab */}
              {inspectorTab === 'advanced' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Validation Rules
                    </label>
                    <select className="w-full h-11 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 mb-2">
                      <option>No validation</option>
                      <option>Email format</option>
                      <option>Phone number</option>
                      <option>URL</option>
                      <option>Custom regex</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Custom validation message"
                      className="w-full h-11 px-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Field ID
                    </label>
                    <input
                      type="text"
                      value={getFocusedField()?.id || ''}
                      disabled
                      className="w-full h-11 px-3 bg-accent border border-border rounded-lg text-sm text-muted-foreground font-mono"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
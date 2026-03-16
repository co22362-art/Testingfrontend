import { useState } from 'react';
import PAAppLayout from '../../components/PAAppLayout';
import { 
  Plus, 
  Search, 
  Eye, 
  Copy, 
  Trash2, 
  MoreVertical,
  FileText,
  Calendar,
  CheckSquare,
  Grid3x3,
  Edit3,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileEdit
} from 'lucide-react';
import FormEditor from './components/FormEditor';
import FormPreview from './components/FormPreview';
import TemplateModal from './components/TemplateModal';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface Form {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  responses: number;
  status: 'draft' | 'published';
}

interface FormBuilderPageProps {
  forms?: Form[];
  onCreateForm?: (form: Omit<Form, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => void;
  onUpdateForm?: (id: string, form: Partial<Form>) => void;
  onDeleteForm?: (id: string) => void;
  onDuplicateForm?: (id: string) => void;
  onPublishForm?: (id: string) => void;
}

export default function FormBuilderPage({
  forms: propForms,
  onCreateForm,
  onUpdateForm,
  onDeleteForm,
  onDuplicateForm,
  onPublishForm
}: FormBuilderPageProps) {
  // Mock data for demonstration
  const defaultForms: Form[] = [
    {
      id: '1',
      name: 'Project Intake Form',
      description: 'Initial project information collection',
      fields: [
        { id: 'f1', type: 'text', label: 'Project Name', required: true },
        { id: 'f2', type: 'email', label: 'Contact Email', required: true },
        { id: 'f3', type: 'select', label: 'Project Type', required: true, options: ['Residential', 'Commercial', 'Industrial'] },
        { id: 'f4', type: 'textarea', label: 'Project Description', required: false },
        { id: 'f5', type: 'date', label: 'Target Start Date', required: true }
      ],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-15',
      responses: 24,
      status: 'published'
    },
    {
      id: '2',
      name: 'Client Feedback Survey',
      description: 'Post-project client satisfaction survey',
      fields: [
        { id: 'f1', type: 'text', label: 'Client Name', required: true },
        { id: 'f2', type: 'radio', label: 'Overall Satisfaction', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
        { id: 'f3', type: 'checkbox', label: 'Service Areas', required: false, options: ['Communication', 'Quality', 'Timeline', 'Budget'] },
        { id: 'f4', type: 'textarea', label: 'Additional Comments', required: false }
      ],
      createdAt: '2024-03-08',
      updatedAt: '2024-03-12',
      responses: 15,
      status: 'published'
    },
    {
      id: '3',
      name: 'Employee Onboarding',
      description: 'New hire information form',
      fields: [
        { id: 'f1', type: 'text', label: 'Full Name', required: true },
        { id: 'f2', type: 'email', label: 'Email Address', required: true },
        { id: 'f3', type: 'text', label: 'Phone Number', required: true },
        { id: 'f4', type: 'date', label: 'Start Date', required: true },
        { id: 'f5', type: 'select', label: 'Department', required: true, options: ['Engineering', 'Design', 'Management', 'Operations'] },
        { id: 'f6', type: 'file', label: 'Resume/CV', required: true }
      ],
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
      responses: 0,
      status: 'draft'
    }
  ];

  const [forms, setForms] = useState<Form[]>(propForms || defaultForms);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'editor' | 'preview'>('list');
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Filter forms based on search
  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    const newForm: Form = {
      id: `form-${Date.now()}`,
      name: 'Untitled Form',
      description: '',
      fields: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: 0,
      status: 'draft'
    };
    setForms([newForm, ...forms]);
    setSelectedForm(newForm);
    setActiveView('editor');
    onCreateForm?.(newForm);
  };

  const handleEdit = (form: Form) => {
    setSelectedForm(form);
    setActiveView('editor');
  };

  const handlePreview = (form: Form) => {
    setSelectedForm(form);
    setActiveView('preview');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setForms(forms.filter(f => f.id !== id));
      onDeleteForm?.(id);
    }
  };

  const handleDuplicate = (form: Form) => {
    const duplicated: Form = {
      ...form,
      id: `form-${Date.now()}`,
      name: `${form.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: 0,
      status: 'draft'
    };
    setForms([duplicated, ...forms]);
    onDuplicateForm?.(form.id);
  };

  const handleSaveForm = (updatedForm: Form) => {
    setForms(forms.map(f => f.id === updatedForm.id ? updatedForm : f));
    onUpdateForm?.(updatedForm.id, updatedForm);
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedForm(null);
  };

  const handlePublish = (form: Form) => {
    const updated = { ...form, status: 'published' as const, updatedAt: new Date().toISOString().split('T')[0] };
    setForms(forms.map(f => f.id === form.id ? updated : f));
    onPublishForm?.(form.id);
  };

  // Render content based on active view
  const renderContent = () => {
    if (activeView === 'editor' && selectedForm) {
      return (
        <FormEditor
          form={selectedForm}
          onSave={handleSaveForm}
          onBack={handleBackToList}
          onPreview={() => setActiveView('preview')}
          onPublish={handlePublish}
        />
      );
    }

    if (activeView === 'preview' && selectedForm) {
      return (
        <FormPreview
          form={selectedForm}
          onBack={handleBackToList}
          onEdit={() => setActiveView('editor')}
          isMobilePreview={isMobilePreview}
          onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        />
      );
    }

    // List view
    return (
      <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-1">Forms</h1>
                <p className="text-sm text-muted-foreground">Create and manage custom forms</p>
              </div>
              {/* Desktop Create Button */}
              <button
                onClick={handleCreateNew}
                className="hidden md:flex h-10 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm items-center gap-2 justify-center transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Form</span>
              </button>
            </div>

            {/* Search Bar - Sleeker */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 md:h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>
          </div>

          {/* Enhanced Metric Cards - Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Forms */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>All</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1 uppercase tracking-wide">Total Forms</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{forms.length}</p>
              </div>
            </div>

            {/* Published */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70 mb-1 uppercase tracking-wide">Published</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  {forms.filter(f => f.status === 'published').length}
                </p>
              </div>
            </div>

            {/* Drafts */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/20 border border-slate-200/50 dark:border-slate-700/30 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-500/10 dark:bg-slate-500/20 flex items-center justify-center">
                  <FileEdit className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600/70 dark:text-slate-400/70 mb-1 uppercase tracking-wide">Drafts</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {forms.filter(f => f.status === 'draft').length}
                </p>
              </div>
            </div>

            {/* Total Responses */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/30 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>Total</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-purple-600/70 dark:text-purple-400/70 mb-1 uppercase tracking-wide">Responses</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {forms.reduce((sum, f) => sum + f.responses, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Metrics Carousel */}
          <div className="md:hidden mb-6 overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {/* Total Forms */}
              <div className="flex-shrink-0 w-36 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Forms</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{forms.length}</p>
              </div>

              {/* Published */}
              <div className="flex-shrink-0 w-36 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70 mb-1">Published</p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {forms.filter(f => f.status === 'published').length}
                </p>
              </div>

              {/* Drafts */}
              <div className="flex-shrink-0 w-36 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/20 border border-slate-200/50 dark:border-slate-700/30 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 dark:bg-slate-500/20 flex items-center justify-center mb-2">
                  <FileEdit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </div>
                <p className="text-xs font-medium text-slate-600/70 dark:text-slate-400/70 mb-1">Drafts</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {forms.filter(f => f.status === 'draft').length}
                </p>
              </div>

              {/* Total Responses */}
              <div className="flex-shrink-0 w-36 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/30 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-2">
                  <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs font-medium text-purple-600/70 dark:text-purple-400/70 mb-1">Responses</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {forms.reduce((sum, f) => sum + f.responses, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Forms Grid */}
          {filteredForms.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground opacity-40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'No forms found' : 'No forms yet'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search query to find what you\'re looking for' 
                  : 'Get started by creating your first form to collect information from your team or clients'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateNew}
                  className="h-11 md:h-10 px-5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm inline-flex items-center gap-2 transition-colors shadow-sm touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Form
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredForms.map(form => {
                // Generate color based on form name hash
                const colorOptions = [
                  { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', dark: 'dark:bg-blue-900/40' },
                  { bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-200', dark: 'dark:bg-emerald-900/40' },
                  { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', dark: 'dark:bg-purple-900/40' },
                  { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200', dark: 'dark:bg-amber-900/40' },
                  { bg: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-200', dark: 'dark:bg-rose-900/40' },
                  { bg: 'bg-cyan-500', light: 'bg-cyan-50', border: 'border-cyan-200', dark: 'dark:bg-cyan-900/40' }
                ];
                const colorIndex = form.name.length % colorOptions.length;
                const formColor = colorOptions[colorIndex];

                return (
                  <div
                    key={form.id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-border/60 transition-all duration-200 group"
                  >
                    {/* Visual Thumbnail Header */}
                    <div className={`h-3 md:h-3 ${formColor.bg}`} />
                    
                    {/* Card Content */}
                    <div className="p-4 md:p-5">
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        {/* Top Row: Name and Quick Edit */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-1">
                              {form.name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {form.description || 'No description provided'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleEdit(form)}
                            className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors shadow-sm touch-manipulation"
                            title="Edit"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                form.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400'
                              }`}
                            >
                              {form.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span className="font-medium text-foreground">{form.responses}</span>
                            <span>responses</span>
                          </div>
                        </div>

                        {/* Bottom Row: Meta Info */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Grid3x3 className="w-3.5 h-3.5" />
                            <span>{form.fields.length} fields</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(form.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:block">
                        {/* Form Name & Status */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-base font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                              {form.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                form.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400'
                              }`}
                            >
                              {form.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                            {form.description || 'No description provided'}
                          </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Fields</p>
                            <p className="text-lg font-semibold text-foreground">{form.fields.length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Responses</p>
                            <p className="text-lg font-semibold text-foreground">{form.responses}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Updated</p>
                            <p className="text-xs font-medium text-foreground mt-1">
                              {new Date(form.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(form)}
                            className="flex-1 h-9 px-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePreview(form)}
                            className="h-9 w-9 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4 text-foreground" />
                          </button>
                          
                          {/* Context Menu */}
                          <div className="relative group/menu">
                            <button className="h-9 w-9 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors">
                              <MoreVertical className="w-4 h-4 text-foreground" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleDuplicate(form)}
                                  className="w-full px-3 py-2 flex items-center gap-2 text-sm text-foreground hover:bg-accent transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => handleDelete(form.id)}
                                  className="w-full px-3 py-2 flex items-center gap-2 text-sm text-destructive hover:bg-accent transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile FAB - New Form */}
        <button
          onClick={handleCreateNew}
          className="md:hidden fixed bottom-6 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all z-20 touch-manipulation"
          title="New Form"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>
    );
  };

  return (
    <PAAppLayout>
      {renderContent()}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(template) => {
          // Handle template selection
          handleCreateNew();
        }}
        onImportJSON={() => {
          // Handle JSON import
          alert('JSON import functionality');
        }}
      />
    </PAAppLayout>
  );
}
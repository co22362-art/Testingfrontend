import { X, FileText, Download, Sparkles } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: 'blank' | 'contact' | 'survey' | 'registration') => void;
  onImportJSON: () => void;
}

const templates = [
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Create a completely new form from the ground up',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Simple contact form with name, email, and message fields',
    icon: Sparkles,
    color: 'emerald',
    fields: 4
  },
  {
    id: 'survey',
    name: 'Customer Survey',
    description: 'Feedback survey with satisfaction ratings and comments',
    icon: Sparkles,
    color: 'purple',
    fields: 6
  },
  {
    id: 'registration',
    name: 'Event Registration',
    description: 'Registration form with personal details and preferences',
    icon: Sparkles,
    color: 'amber',
    fields: 8
  }
];

export default function TemplateModal({ isOpen, onClose, onSelectTemplate, onImportJSON }: TemplateModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Create New Form</h2>
              <p className="text-sm text-muted-foreground">Choose how you want to start building</p>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {templates.map((template) => {
                const Icon = template.icon;
                const colorClasses = {
                  blue: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/30',
                  emerald: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30',
                  purple: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/30',
                  amber: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200/50 dark:border-amber-800/30'
                };
                const iconColors = {
                  blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20',
                  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20',
                  purple: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20',
                  amber: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20'
                };

                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template.id as any);
                      onClose();
                    }}
                    className={`bg-gradient-to-br ${colorClasses[template.color as keyof typeof colorClasses]} border rounded-xl p-5 text-left hover:shadow-md transition-all group`}
                  >
                    <div className={`w-12 h-12 rounded-lg ${iconColors[template.color as keyof typeof iconColors]} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    {template.fields && (
                      <div className="text-xs text-muted-foreground">
                        {template.fields} fields included
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Import Option */}
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => {
                  onImportJSON();
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-accent/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Import from JSON
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Upload a previously exported form configuration
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

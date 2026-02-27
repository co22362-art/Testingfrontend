import { useState, ChangeEvent } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

interface GroupPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExpandedModules {
  [key: string]: boolean;
}

interface CheckedModules {
  [key: string]: boolean;
}

export default function GroupPermissionsModal({ isOpen, onClose }: GroupPermissionsModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [expandedModules, setExpandedModules] = useState<ExpandedModules>({
    projectAssist: true,
    projectAssistWeb: true
  });
  const [checkedModules, setCheckedModules] = useState<CheckedModules>({
    projectAssist: false,
    projectAssistWeb: false,
    projectManager: false,
    mailManager: false,
    itManager: false
  });
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const toggleModule = (module: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const handleCheckModule = (module: string) => {
    setCheckedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Permissions</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Column 1 - Group Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">1. Select the Group</h3>
              <select
                value={selectedGroup}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedGroup(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
              >
                <option value="">-- Select Group --</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Column 2 - Modules */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">2. Select the Modules</h3>
              <div className="space-y-2">
                <div className="border border-gray-200 rounded-lg p-2">
                  <button 
                    onClick={() => toggleModule('projectAssist')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={checkedModules.projectAssist}
                        onChange={() => handleCheckModule('projectAssist')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Project Assist</span>
                    </div>
                    {expandedModules.projectAssist ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3 - Notes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">3. Add Notes</h3>
              <textarea
                value={notes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="h-10 px-6 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button className="h-10 px-6 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-colors">
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
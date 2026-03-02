import { useState, useEffect, useRef } from 'react';
import PAAppLayout from '../../components/PAAppLayout';
import PASidebarHeader from '../../components/ui/PASidebarHeader';
import PASidebarCard from '../../components/ui/PASidebarCard';
import { 
  FolderOpen,
  X,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import PAButton from '../../components/ui/PAButton';
import PAInput from '../../components/ui/PAInput';
import { Badge } from '../../components/ui/badge';
import {
  mockProjectGroups,
  mockDefaultSettings,
  type ProjectGroup,
  type GroupSettings
} from '@/app/data/mockProjectGroupData';

const STORAGE_KEY = 'project-groups-sidebar-width';
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 250;
const MAX_WIDTH = 600;

const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function ProjectGroupPage() {
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [groupSearch, setGroupSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
  });
  const [isDragging, setIsDragging] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<GroupSettings>(mockDefaultSettings);
  const [originalSettings, setOriginalSettings] = useState<GroupSettings>(mockDefaultSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newGroupName, setNewGroupName] = useState('');
  const [generalDirectory, setGeneralDirectory] = useState('');
  const [hasRestrictedDir, setHasRestrictedDir] = useState(false);
  const [restrictedDirectory, setRestrictedDirectory] = useState('');
  const [settingsSource, setSettingsSource] = useState<'existing' | 'template' | 'blank'>('blank');
  const [selectedExistingGroup, setSelectedExistingGroup] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formError, setFormError] = useState('');

  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const filteredGroups = mockProjectGroups.filter(group =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  useEffect(() => {
    const settingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(settingsChanged);
  }, [settings, originalSettings]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartWidth.current + delta));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, sidebarWidth]);

  const handleSettingChange = (key: keyof GroupSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    // Mock save
    await new Promise(resolve => setTimeout(resolve, 500));
    setOriginalSettings(settings);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setHasUnsavedChanges(false);
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      handleCreateGroup();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCreateGroup = async () => {
    setIsCreating(true);
    setFormError('');
    
    // Mock creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCreating(false);
    setIsCreateModalOpen(false);
    resetModal();
  };

  const resetModal = () => {
    setCurrentStep(1);
    setNewGroupName('');
    setGeneralDirectory('');
    setHasRestrictedDir(false);
    setRestrictedDirectory('');
    setSettingsSource('blank');
    setSelectedExistingGroup('');
    setSelectedTemplate('');
    setFormError('');
  };

  const renderModalStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 py-4">
            <PAInput
              label="Project Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter project group name"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 py-4">
            <PAInput
              label="General Directory"
              value={generalDirectory}
              onChange={(e) => setGeneralDirectory(e.target.value)}
              placeholder="Enter general directory path"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">Create Restricted Directory</span>
              <Switch checked={hasRestrictedDir} onCheckedChange={setHasRestrictedDir} />
            </div>
            {hasRestrictedDir && (
              <PAInput
                label="Restricted Directory"
                value={restrictedDirectory}
                onChange={(e) => setRestrictedDirectory(e.target.value)}
                placeholder="Enter restricted directory path"
              />
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Use Settings From</label>
              
              <div className="space-y-2">
                <div
                  onClick={() => setSettingsSource('existing')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    settingsSource === 'existing'
                      ? 'border-primary bg-accent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current mt-0.5 flex items-center justify-center">
                    {settingsSource === 'existing' && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Copy from an existing project group</p>
                    {settingsSource === 'existing' && (
                      <Select value={selectedExistingGroup} onValueChange={setSelectedExistingGroup}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a project group" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProjectGroups.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setSettingsSource('template')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    settingsSource === 'template'
                      ? 'border-primary bg-accent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current mt-0.5 flex items-center justify-center">
                    {settingsSource === 'template' && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Use a default template</p>
                    {settingsSource === 'template' && (
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="template1">Standard Template</SelectItem>
                          <SelectItem value="template2">Advanced Template</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setSettingsSource('blank')}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    settingsSource === 'blank'
                      ? 'border-primary bg-accent'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current mt-0.5 flex items-center justify-center">
                    {settingsSource === 'blank' && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Blank (no preset settings)</p>
                    {settingsSource === 'blank' && (
                      <p className="text-xs text-muted-foreground mt-1">No settings will be copied.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PAAppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Project Groups Sidebar */}
        <div
          style={{ width: `${sidebarWidth}px` }}
          className="flex flex-col border-r border-border bg-card relative"
        >
          {/* Header */}
          <PASidebarHeader
            title="Project Groups"
            searchValue={groupSearch}
            onSearchChange={setGroupSearch}
            onAdd={() => setIsCreateModalOpen(true)}
          />

          {/* Error State */}
          {error && (
            <div className="px-4 py-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Project Groups List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground px-4 text-center">
                No project groups found.
              </div>
            ) : (
              <div className="p-2">
                {filteredGroups.map((group) => (
                  <PASidebarCard
                    key={group.id}
                    initials={getInitials(group.name)}
                    title={group.name}
                    subtitle={`${group.active_users} projects`}
                    isSelected={selectedGroup?.id === group.id}
                    badgeCount={group.badge_count}
                    onClick={() => setSelectedGroup(group)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-border hover:bg-primary/40 transition-colors z-10"
          />
        </div>

        {/* RIGHT PANEL - Project Group Detail */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {!selectedGroup ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a project group to view/edit settings</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                {/* Page Heading */}
                <h1 className="text-2xl font-bold text-foreground mb-6">{selectedGroup.name}</h1>

                {/* Settings Cards */}
                <div className="space-y-6 max-w-4xl">
                  {/* CARD 1 - General Settings */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">General Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Categorise projects by year</span>
                        <Switch
                          checked={settings.yearwise_categorise}
                          onCheckedChange={(val) => handleSettingChange('yearwise_categorise', val)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Allow project number editing</span>
                        <Switch
                          checked={settings.allow_project_number_edit}
                          onCheckedChange={(val) => handleSettingChange('allow_project_number_edit', val)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Classify projects</span>
                        <Switch
                          checked={settings.classify_projects}
                          onCheckedChange={(val) => handleSettingChange('classify_projects', val)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Enable project creation form</span>
                        <Switch
                          checked={settings.initiate_project_creation_form}
                          onCheckedChange={(val) => handleSettingChange('initiate_project_creation_form', val)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Confidential directory</span>
                        <Switch
                          checked={settings.confidential_directory}
                          onCheckedChange={(val) => handleSettingChange('confidential_directory', val)}
                        />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <PAInput
                          label="Project Number Format"
                          value={settings.project_number_format}
                          onChange={(e) => handleSettingChange('project_number_format', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use YY for year, XX for sequence, ZZ for suffix
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* CARD 2 - Module Access */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Module Access</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Mail Settings</span>
                        <Switch
                          checked={settings.allow_mail_settings}
                          onCheckedChange={(val) => handleSettingChange('allow_mail_settings', val)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Quality Settings</span>
                        <Switch
                          checked={settings.allow_quality_settings}
                          onCheckedChange={(val) => handleSettingChange('allow_quality_settings', val)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">Drawing Settings</span>
                        <Switch
                          checked={settings.allow_drawing_settings}
                          onCheckedChange={(val) => handleSettingChange('allow_drawing_settings', val)}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* CARD 3 - Quality Forms */}
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Quality Forms</h2>
                    <div className="space-y-2">
                      <PAInput
                        value={settings.quality_forms_path}
                        onChange={(e) => handleSettingChange('quality_forms_path', e.target.value)}
                        placeholder="No folder path set"
                      />
                      <p className="text-xs text-muted-foreground">
                        Path to the shared quality forms folder
                      </p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Sticky Footer */}
              {hasUnsavedChanges && (
                <div className="border-t border-border bg-card p-4">
                  <div className="flex items-center gap-2 max-w-4xl">
                    <PAButton onClick={handleSaveChanges}>
                      Save Changes
                    </PAButton>
                    <PAButton variant="ghost" onClick={handleReset}>
                      Reset
                    </PAButton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Project Group Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        if (!open) resetModal();
        setIsCreateModalOpen(open);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Create Project Group</DialogTitle>
                <DialogDescription>Step {currentStep} of 4</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {renderModalStep()}

          <DialogFooter>
            <PAButton
              variant="ghost"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isCreating}
            >
              Back
            </PAButton>
            <PAButton
              onClick={handleNextStep}
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentStep === 4 ? (isCreating ? 'Creating...' : 'Create') : 'Next'}
            </PAButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PAAppLayout>
  );
}

import { useState, useEffect, useRef } from 'react';
import PAAppLayout from '../../components/PAAppLayout';
import { 
  Folder, 
  FolderOpen,
  ChevronRight, 
  ChevronDown,
  X,
  Check,
  Search,
  UserPlus
} from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import PAButton from '../../components/ui/PAButton';
import PAUserSelectorDialog from '../../components/ui/PAUserSelectorDialog';
import PAProjectTree, { PAProjectGroup, PATreeNode } from '@/app/components/ui/PAProjectTree';
import { mockProjectGroups } from '@/app/data/mockProjectData';

// Types
type ProjectStatus = 'Ongoing' | 'Completed' | 'Archived';

interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
}

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  subtitle?: string;
}

// Mock Data for PAProjectTree
const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Aman Singh', initials: 'AS' },
  { id: '2', name: 'Aditya Mehta', initials: 'AM' }
];

const mockProjectManagers: TeamMember[] = [
  { id: '3', name: 'Varun Garg', initials: 'VG' }
];

// Available users to add (not yet assigned to project)
const mockAvailableUsers: TeamMember[] = [
  { id: '4', name: 'Shubham Rastogi', initials: 'SR', subtitle: 'Intermediate Designer' },
  { id: '5', name: 'Manjot Singh', initials: 'MS', subtitle: 'Junior Designer' },
  { id: '6', name: 'Tarun Garg', initials: 'TG', subtitle: 'Senior Drafter' },
  { id: '7', name: 'Abhinav Heera', initials: 'AH', subtitle: 'Junior Designer' }
];

const STORAGE_KEY = 'projects-sidebar-width';
const DEFAULT_WIDTH = 300;
const MIN_WIDTH = 250;
const MAX_WIDTH = 560;

export default function ProjectsPage() {
  const [selectedNode, setSelectedNode] = useState<PATreeNode | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectGroup, setSelectedProjectGroup] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [statusFilters, setStatusFilters] = useState<Set<ProjectStatus>>(new Set(['Ongoing']));
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [projectManagers, setProjectManagers] = useState<TeamMember[]>(mockProjectManagers);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [isTeamMemberDialogOpen, setIsTeamMemberDialogOpen] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_WIDTH);

  // Load sidebar width from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const width = parseInt(stored, 10);
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  // Auto-expand first group and first year on load
  useEffect(() => {
    if (mockProjectGroups.length > 0) {
      const firstGroup = mockProjectGroups[0];
      
      // Select first project by default
      if (firstGroup.projects.length > 0) {
        const firstProject = firstGroup.projects[0];
        setSelectedNode({
          type: 'project',
          id: firstProject.id,
          groupId: firstGroup.id,
          label: firstProject.name
        });
        setSelectedProject({
          id: firstProject.id,
          name: firstProject.name,
          status: firstProject.status.charAt(0).toUpperCase() + firstProject.status.slice(1) as ProjectStatus
        });
        setSelectedProjectGroup(firstGroup.name);
      }
    }
  }, []);

  // Handle resize
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

  // Toggle functions
  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleYear = (groupId: string, year: number) => {
    const key = `${groupId}-${year}`;
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedYears(newExpanded);
  };

  // Status filter functions
  const toggleStatusFilter = (status: ProjectStatus) => {
    const newFilters = new Set(statusFilters);
    if (newFilters.has(status)) {
      // Don't allow unchecking the last filter
      if (newFilters.size > 1) {
        newFilters.delete(status);
      }
    } else {
      newFilters.add(status);
    }
    setStatusFilters(newFilters);
  };

  const getStatusFilterLabel = () => {
    if (statusFilters.size === 3) return 'All Projects';
    if (statusFilters.size === 1) return `${Array.from(statusFilters)[0]} Projects`;
    return `${Array.from(statusFilters).join(', ')} Projects`;
  };

  // Add team member
  const handleAddTeamMember = (user: TeamMember) => {
    setTeamMembers([...teamMembers, user]);
  };

  // Add project manager
  const handleAddManager = (user: TeamMember) => {
    setProjectManagers([...projectManagers, user]);
  };

  // Remove team member
  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  // Remove project manager
  const handleRemoveManager = (id: string) => {
    setProjectManagers(projectManagers.filter(manager => manager.id !== id));
  };

  // Get excluded IDs for dialogs
  const getExcludedManagerIds = () => projectManagers.map(m => m.id);
  const getExcludedTeamMemberIds = () => teamMembers.map(m => m.id);

  // Convert status filters to lowercase for PAProjectTree
  const selectedStatuses = Array.from(statusFilters).map(s => s.toLowerCase() as 'ongoing' | 'completed' | 'archived');

  // Filter PAProjectTree groups by status and search
  const filteredPAGroups = mockProjectGroups.map(group => ({
    ...group,
    projects: group.projects.filter(p => {
      const matchesStatus = selectedStatuses.includes(p.status);
      const matchesSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.projectNumber?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    })
  })).filter(group => group.projects.length > 0);

  // Show status badge only when more than one status is selected
  const showStatusBadge = selectedStatuses.length > 1;

  // Handle node selection
  const handleNodeSelect = (node: PATreeNode) => {
    setSelectedNode(node);
    
    // Only update right panel if it's a project
    if (node.type === 'project') {
      // Find the project in mockProjectGroups
      for (const group of mockProjectGroups) {
        const project = group.projects.find(p => p.id === node.id);
        if (project) {
          setSelectedProjectGroup(group.name);
          setSelectedProject({
            id: project.id,
            name: project.name,
            status: project.status.charAt(0).toUpperCase() + project.status.slice(1) as ProjectStatus
          });
          break;
        }
      }
    }
  };

  return (
    <PAAppLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          ref={resizeRef}
          style={{ width: `${sidebarWidth}px` }}
          className="flex-shrink-0 border-r border-border bg-card flex flex-col relative"
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between mb-3 min-h-8">
              <h2 className="text-base font-semibold text-foreground">{getStatusFilterLabel()}</h2>
              <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-primary transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
                  <div className="space-y-2">
                    {(['Ongoing', 'Completed', 'Archived'] as ProjectStatus[]).map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={status}
                          checked={statusFilters.has(status)}
                          onCheckedChange={() => toggleStatusFilter(status)}
                        />
                        <label
                          htmlFor={status}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : filteredPAGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <FolderOpen className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No projects found</p>
              </div>
            ) : (
              <div className="p-2">
                <PAProjectTree
                  groups={filteredPAGroups}
                  selectedNode={selectedNode}
                  onNodeSelect={handleNodeSelect}
                  showStatusBadge={showStatusBadge}
                />
              </div>
            )}
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-border hover:bg-primary/40 transition-colors z-10"
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto bg-background">
          {!selectedProject ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a project to view details</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Project Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-1">{selectedProject.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedProjectGroup}</p>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column: Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>{selectedProject.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <p className="text-sm text-muted-foreground">Status panel placeholder.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Project Managers Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Project Managers</CardTitle>
                        <button
                          onClick={() => setIsManagerDialogOpen(true)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {projectManagers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No project managers assigned.</p>
                      ) : (
                        <div className="space-y-2">
                          {projectManagers.map((manager) => (
                            <div key={manager.id} className="flex items-center gap-3 py-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                {manager.initials}
                              </div>
                              <span className="flex-1 text-sm text-foreground">{manager.name}</span>
                              <button
                                onClick={() => handleRemoveManager(manager.id)}
                                className="p-1 hover:bg-accent rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Team Members Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Team Members</CardTitle>
                        <button
                          onClick={() => setIsTeamMemberDialogOpen(true)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {teamMembers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No team members assigned.</p>
                      ) : (
                        <div className="space-y-2">
                          {teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-3 py-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                {member.initials}
                              </div>
                              <span className="flex-1 text-sm text-foreground">{member.name}</span>
                              <button
                                onClick={() => handleRemoveTeamMember(member.id)}
                                className="p-1 hover:bg-accent rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Selector Dialogs */}
        <PAUserSelectorDialog
          open={isManagerDialogOpen}
          onOpenChange={setIsManagerDialogOpen}
          title="Add Project Manager"
          users={mockAvailableUsers}
          onSelect={handleAddManager}
          excludeIds={getExcludedManagerIds()}
        />

        <PAUserSelectorDialog
          open={isTeamMemberDialogOpen}
          onOpenChange={setIsTeamMemberDialogOpen}
          title="Add Team Member"
          users={mockAvailableUsers}
          onSelect={handleAddTeamMember}
          excludeIds={getExcludedTeamMemberIds()}
        />
      </div>
    </PAAppLayout>
  );
}
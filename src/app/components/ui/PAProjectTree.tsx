import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Lock, Folder, FolderOpen } from 'lucide-react';

export interface PAProject {
  id: string;
  name: string;
  projectNumber?: string;
  year: number; // 0 means no year grouping
  status: 'ongoing' | 'completed' | 'archived';
  isConfidential: boolean;
}

export interface PAProjectGroup {
  id: string;
  name: string;
  hasConfidential: boolean;
  projects: PAProject[];
}

export type PATreeNodeType = 'group' | 'category' | 'year' | 'project';

export interface PATreeNode {
  type: PATreeNodeType;
  id: string;        // group.id / 'working' / 'confidential' / String(year) / project.id
  groupId: string;   // always the parent group id
  label: string;
}

export interface PAProjectTreeProps {
  groups: PAProjectGroup[];
  selectedNode?: PATreeNode | null;
  onNodeSelect: (node: PATreeNode) => void;
  showStatusBadge?: boolean;
  renderSubItems?: (node: PATreeNode) => React.ReactNode;
  className?: string;
}

const mockGroups: PAProjectGroup[] = [
  {
    id: 'g1',
    name: 'IND PROJECTS',
    hasConfidential: true,
    projects: [
      { id: 'p1', name: 'Structural Analysis Phase 1', projectNumber: 'IND-001', year: 2023, status: 'ongoing', isConfidential: false },
      { id: 'p2', name: 'Foundation Design', projectNumber: 'IND-002', year: 2023, status: 'completed', isConfidential: false },
      { id: 'p3', name: 'Client A Confidential Review', projectNumber: 'IND-003', year: 2023, status: 'ongoing', isConfidential: true },
    ]
  },
  {
    id: 'g2',
    name: '2026Testing',
    hasConfidential: false,
    projects: [
      { id: 'p4', name: 'Test Project Alpha', projectNumber: 'TP-001', year: 2026, status: 'ongoing', isConfidential: false },
      { id: 'p5', name: 'Test Project Beta', projectNumber: 'TP-002', year: 2026, status: 'archived', isConfidential: false },
    ]
  },
  {
    id: 'g3',
    name: 'AMAN TESTING NEW',
    hasConfidential: true,
    projects: [
      { id: 'p6', name: 'Sample Working Project', projectNumber: 'AT-001', year: 2023, status: 'ongoing', isConfidential: false },
    ]
  }
];

const STORAGE_KEY = 'pa-project-tree-expanded';

// Helper to create stable keys for expanded state
const createExpandedKey = (type: string, id: string, groupId?: string): string => {
  if (type === 'group') return `group:${id}`;
  if (type === 'category') return `category:${groupId}:${id}`;
  if (type === 'year') return `year:${groupId}:${id}`;
  return '';
};

// Load expanded state from localStorage
const loadExpandedState = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return new Set(parsed);
    } catch {
      return new Set();
    }
  }
  return new Set();
};

// Save expanded state to localStorage
const saveExpandedState = (expanded: Set<string>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(expanded)));
};

export default function PAProjectTree({
  groups = mockGroups,
  selectedNode = null,
  onNodeSelect = () => {},
  showStatusBadge = true,
  renderSubItems,
  className = ''
}: PAProjectTreeProps) {
  // Initialize expanded state from localStorage, defaulting all to expanded
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const stored = loadExpandedState();
    // If nothing in storage, default all to expanded
    if (stored.size === 0) {
      const defaultExpanded = new Set<string>();
      groups.forEach(group => {
        defaultExpanded.add(createExpandedKey('group', group.id));
        if (group.hasConfidential) {
          defaultExpanded.add(createExpandedKey('category', 'working', group.id));
          defaultExpanded.add(createExpandedKey('category', 'confidential', group.id));
        }
        // Add all years
        const years = [...new Set(group.projects.map(p => p.year))];
        years.forEach(year => {
          if (year > 0) {
            defaultExpanded.add(createExpandedKey('year', String(year), group.id));
          }
        });
      });
      saveExpandedState(defaultExpanded);
      return defaultExpanded;
    }
    return stored;
  });

  // Persist to localStorage whenever expanded changes
  useEffect(() => {
    saveExpandedState(expanded);
  }, [expanded]);

  const toggleExpanded = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isNodeSelected = (node: PATreeNode): boolean => {
    if (!selectedNode) return false;
    return (
      selectedNode.type === node.type &&
      selectedNode.id === node.id &&
      selectedNode.groupId === node.groupId
    );
  };

  const getStatusBadgeStyles = (status: 'ongoing' | 'completed' | 'archived'): string => {
    if (status === 'ongoing') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'completed') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400';
  };

  const renderProjectRow = (project: PAProject, groupId: string, indent: string) => {
    const node: PATreeNode = {
      type: 'project',
      id: project.id,
      groupId,
      label: project.name
    };
    const isSelected = isNodeSelected(node);
    const hasSubItems = isSelected && renderSubItems;

    return (
      <div key={project.id}>
        <button
          onClick={() => onNodeSelect(node)}
          className={`w-full flex justify-between items-center ${indent} py-0.5 px-2 rounded-sm cursor-pointer transition-colors text-left hover:bg-accent/30 ${
            isSelected
              ? 'border-l-[3px] border-l-primary bg-accent/40'
              : ''
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasSubItems && (
              <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            )}
            <Folder className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <div className="flex items-baseline gap-2 flex-1 min-w-0">
              {project.projectNumber && (
                <span className="text-sm text-primary font-medium flex-shrink-0">{project.projectNumber}</span>
              )}
              <span className="text-sm text-foreground font-normal truncate">{project.name}</span>
            </div>
          </div>
          
          {showStatusBadge && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize font-medium flex-shrink-0 ${getStatusBadgeStyles(project.status)}`}>
              {project.status}
            </span>
          )}
        </button>

        {/* Render sub-items if selected and renderSubItems provided */}
        {hasSubItems && (
          <div className={`${indent} pl-4`}>
            {renderSubItems(node)}
          </div>
        )}
      </div>
    );
  };

  // Helper function to render projects grouped by year
  const renderProjectsWithYears = (projects: PAProject[], groupId: string, baseIndent: string, underCategory: boolean) => {
    // Get unique years sorted descending
    const years = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a);
    
    return years.map(year => {
      const yearProjects = projects.filter(p => p.year === year);
      
      if (year === 0) {
        // No year grouping - render projects directly
        return yearProjects.map(project => renderProjectRow(project, groupId, baseIndent));
      } else {
        // Year grouping - render year row + projects
        const yearKey = createExpandedKey('year', String(year), groupId);
        const isYearExpanded = expanded.has(yearKey);
        const YearChevron = isYearExpanded ? ChevronDown : ChevronRight;
        const yearIndent = underCategory ? 'pl-8' : 'pl-4';
        const projectIndent = underCategory ? 'pl-12' : 'pl-8';

        const yearNode: PATreeNode = {
          type: 'year',
          id: String(year),
          groupId,
          label: String(year)
        };
        const isYearSelected = isNodeSelected(yearNode);

        return (
          <div key={yearKey}>
            {/* Year Row */}
            <button
              onClick={() => {
                toggleExpanded(yearKey);
                onNodeSelect(yearNode);
              }}
              className={`w-full flex items-center gap-2 ${yearIndent} py-0.5 px-2 rounded hover:bg-accent/30 transition-colors text-left ${
                isYearSelected ? 'border-l-[3px] border-l-primary bg-accent/40' : ''
              }`}
            >
              <YearChevron className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground font-normal">{year}</span>
            </button>

            {/* Projects under Year */}
            {isYearExpanded && (
              <div className="flex flex-col">
                {yearProjects.map(project => renderProjectRow(project, groupId, projectIndent))}
              </div>
            )}
          </div>
        );
      }
    });
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {groups.map(group => {
        const groupKey = createExpandedKey('group', group.id);
        const isGroupExpanded = expanded.has(groupKey);
        const ChevronIcon = isGroupExpanded ? ChevronDown : ChevronRight;
        const FolderIcon = isGroupExpanded ? FolderOpen : Folder;

        const groupNode: PATreeNode = {
          type: 'group',
          id: group.id,
          groupId: group.id,
          label: group.name
        };
        const isGroupSelected = isNodeSelected(groupNode);

        return (
          <div key={group.id}>
            {/* Group Row */}
            <button
              onClick={() => {
                toggleExpanded(groupKey);
                onNodeSelect(groupNode);
              }}
              className={`w-full flex items-center gap-2 py-0.5 px-2 rounded hover:bg-accent/30 transition-colors text-left ${
                isGroupSelected ? 'border-l-[3px] border-l-primary bg-accent/40' : ''
              }`}
            >
              <ChevronIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <FolderIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground font-normal">{group.name}</span>
            </button>

            {/* Group Content */}
            {isGroupExpanded && (
              <div className="flex flex-col">
                {group.hasConfidential ? (
                  <>
                    {/* Working Category */}
                    {(() => {
                      const workingProjects = group.projects.filter(p => !p.isConfidential);
                      if (workingProjects.length === 0) return null;

                      const workingKey = createExpandedKey('category', 'working', group.id);
                      const isWorkingExpanded = expanded.has(workingKey);
                      const WorkingChevron = isWorkingExpanded ? ChevronDown : ChevronRight;

                      const workingNode: PATreeNode = {
                        type: 'category',
                        id: 'working',
                        groupId: group.id,
                        label: 'Working'
                      };
                      const isWorkingSelected = isNodeSelected(workingNode);

                      return (
                        <div key={workingKey}>
                          {/* Working Row */}
                          <button
                            onClick={() => {
                              toggleExpanded(workingKey);
                              onNodeSelect(workingNode);
                            }}
                            className={`w-full flex items-center gap-2 pl-4 py-0.5 px-2 rounded hover:bg-accent/30 transition-colors text-left ${
                              isWorkingSelected ? 'border-l-[3px] border-l-primary bg-accent/40' : ''
                            }`}
                          >
                            <WorkingChevron className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground font-normal">Working</span>
                          </button>

                          {/* Working Projects */}
                          {isWorkingExpanded && (
                            <div className="flex flex-col">
                              {renderProjectsWithYears(workingProjects, group.id, 'pl-8', true)}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Confidential Category */}
                    {(() => {
                      const confidentialProjects = group.projects.filter(p => p.isConfidential);
                      if (confidentialProjects.length === 0) return null;

                      const confidentialKey = createExpandedKey('category', 'confidential', group.id);
                      const isConfidentialExpanded = expanded.has(confidentialKey);
                      const ConfidentialChevron = isConfidentialExpanded ? ChevronDown : ChevronRight;

                      const confidentialNode: PATreeNode = {
                        type: 'category',
                        id: 'confidential',
                        groupId: group.id,
                        label: 'Confidential'
                      };
                      const isConfidentialSelected = isNodeSelected(confidentialNode);

                      return (
                        <div key={confidentialKey}>
                          {/* Confidential Row */}
                          <button
                            onClick={() => {
                              toggleExpanded(confidentialKey);
                              onNodeSelect(confidentialNode);
                            }}
                            className={`w-full flex items-center gap-2 pl-4 py-0.5 px-2 rounded hover:bg-accent/30 transition-colors text-left ${
                              isConfidentialSelected ? 'border-l-[3px] border-l-primary bg-accent/40' : ''
                            }`}
                          >
                            <ConfidentialChevron className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground font-normal">Confidential</span>
                          </button>

                          {/* Confidential Projects */}
                          {isConfidentialExpanded && (
                            <div className="flex flex-col">
                              {renderProjectsWithYears(confidentialProjects, group.id, 'pl-8', true)}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  // No confidential split - render all projects directly
                  renderProjectsWithYears(group.projects, group.id, 'pl-4', false)
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

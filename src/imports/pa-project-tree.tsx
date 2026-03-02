Create a new file src/app/components/ui/PAProjectTree.tsx.

This is a reusable tree component used across Projects, Mail, and CAD Manager pages.

--- TYPES ---

export interface PAProject {
  id: string
  name: string
  projectNumber?: string
  status: 'ongoing' | 'completed' | 'archived'
  isConfidential: boolean
}

export interface PAProjectGroup {
  id: string
  name: string
  hasConfidential: boolean
  projects: PAProject[]
}

export interface PAProjectTreeProps {
  groups: PAProjectGroup[]
  selectedProjectId?: string | null
  onProjectSelect: (projectId: string) => void
  showStatusBadge?: boolean
  renderSubItems?: (projectId: string) => React.ReactNode
  className?: string
}

--- COMPONENT ---

For now, implement only the case where group.hasConfidential === false.
Treat all groups as flat — no categories, projects listed directly under the group.

Tree structure:
  Level 0 — Group row
  Level 1 — Project rows (directly under group, pl-4 indent)

Group row styling:
- ChevronRight / ChevronDown toggle icon on the left
- font-semibold text-sm group name
- Full row clickable to expand/collapse
- All groups start expanded by default (useState per group)
- py-1 px-2 rounded hover:bg-accent/50

Project row styling:
- pl-6 indent
- If projectNumber present: show it in text-xs text-muted-foreground followed by the name in text-sm
- If no projectNumber: just show name in text-sm
- Selected state: border-l-[3px] border-l-primary bg-primary/5
- Hover: hover:bg-accent/50
- cursor-pointer py-1 px-2 rounded-sm
- Clicking calls onProjectSelect(project.id)

--- MOCK DATA (for Figma preview) ---

const mockGroups: PAProjectGroup[] = [
  {
    id: 'g1',
    name: '2026Testing',
    hasConfidential: false,
    projects: [
      { id: 'p1', name: 'Test Project Alpha', projectNumber: 'TP-001', status: 'ongoing', isConfidential: false },
      { id: 'p2', name: 'Test Project Beta', projectNumber: 'TP-002', status: 'completed', isConfidential: false },
    ]
  },
  {
    id: 'g2',
    name: 'AMAN TESTING NEW',
    hasConfidential: false,
    projects: [
      { id: 'p3', name: 'Sample Project', projectNumber: 'AT-001', status: 'ongoing', isConfidential: false },
    ]
  }
]

Default export the component. Use selectedProjectId='p1' in preview.

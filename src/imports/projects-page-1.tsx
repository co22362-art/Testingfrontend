Update src/app/modules/3002_projects/ProjectsPage.tsx.

Replace the existing custom tree implementation in the left sidebar
with the new PAProjectTree component.

--- IMPORTS ---

Add:
import PAProjectTree, { PAProjectGroup } from '@/app/components/ui/PAProjectTree'

--- MOCK DATA ---

Replace any existing project mock data with PAProjectGroup format:

const mockProjectGroups: PAProjectGroup[] = [
  {
    id: 'g1',
    name: 'IND PROJECTS',
    hasConfidential: true,
    projects: [
      { id: 'p1', name: 'Structural Analysis Phase 1', projectNumber: 'IND-001', status: 'ongoing', isConfidential: false },
      { id: 'p2', name: 'Foundation Design', projectNumber: 'IND-002', status: 'completed', isConfidential: false },
      { id: 'p3', name: 'Client A Confidential Review', projectNumber: 'IND-003', status: 'ongoing', isConfidential: true },
    ]
  },
  {
    id: 'g2',
    name: '2026Testing',
    hasConfidential: false,
    projects: [
      { id: 'p4', name: 'Test Project Alpha', projectNumber: 'TP-001', status: 'ongoing', isConfidential: false },
      { id: 'p5', name: 'Test Project Beta', projectNumber: 'TP-002', status: 'archived', isConfidential: false },
    ]
  },
  {
    id: 'g3',
    name: 'AMAN TESTING NEW',
    hasConfidential: true,
    projects: [
      { id: 'p6', name: 'Sample Working Project', projectNumber: 'AT-001', status: 'ongoing', isConfidential: false },
      { id: 'p7', name: 'Confidential Tender', projectNumber: 'AT-002', status: 'ongoing', isConfidential: true },
    ]
  }
]

--- FILTER LOGIC ---

Keep the existing status filter (Ongoing / Completed / Archived checkboxes
in the page title dropdown). But filter the groups before passing to PAProjectTree:

const selectedStatuses: string[] = [...] // from filter state, e.g. ['ongoing', 'completed']

const filteredGroups = mockProjectGroups.map(group => ({
  ...group,
  projects: group.projects.filter(p => selectedStatuses.includes(p.status))
})).filter(group => group.projects.length > 0)

--- SHOW STATUS BADGE LOGIC ---

Only show status badges when more than one status type is currently selected
in the filter. If exactly one status is selected, pass showStatusBadge={false}.

const showStatusBadge = selectedStatuses.length > 1

--- WIRE UP ---

Replace the existing tree JSX with:

<PAProjectTree
  groups={filteredGroups}
  selectedProjectId={selectedProjectId}
  onProjectSelect={(id) => setSelectedProjectId(id)}
  showStatusBadge={showStatusBadge}
/>

Keep the existing selectedProjectId state and right panel (Project Managers +
Team Members) unchanged. Keep the existing sidebar resize handle unchanged.

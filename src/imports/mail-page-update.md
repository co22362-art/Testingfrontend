Update src/app/modules/3003_mail/MailPage.tsx.

Replace the existing custom project tree in the left sidebar
with the PAProjectTree component.

--- IMPORTS ---

Add:
import PAProjectTree, { PAProjectGroup } from '@/app/components/ui/PAProjectTree'

--- MOCK DATA ---

Add this mock data (same shape as ProjectsPage for consistency):

const mockProjectGroups: PAProjectGroup[] = [
  {
    id: 'g1',
    name: 'IND PROJECTS',
    hasConfidential: true,
    projects: [
      { id: 'p1', name: 'Structural Analysis Phase 1', projectNumber: 'IND-001', status: 'ongoing', isConfidential: false },
      { id: 'p2', name: 'Foundation Design', projectNumber: 'IND-002', status: 'ongoing', isConfidential: false },
      { id: 'p3', name: 'Client A Confidential Review', projectNumber: 'IND-003', status: 'ongoing', isConfidential: true },
    ]
  },
  {
    id: 'g2',
    name: '2026Testing',
    hasConfidential: false,
    projects: [
      { id: 'p4', name: 'Test Project Alpha', projectNumber: 'TP-001', status: 'ongoing', isConfidential: false },
      { id: 'p5', name: 'Test Project Beta', projectNumber: 'TP-002', status: 'ongoing', isConfidential: false },
    ]
  }
]

--- MAIL LABELS AS SUB-ITEMS ---

In Mail, when a project is selected in the tree, show mail labels under it
as the 4th level using the renderSubItems prop.

Add a mock labels map:

const mockProjectLabels: Record<string, string[]> = {
  'p1': ['Inbox', 'Sent', 'Follow Up'],
  'p2': ['Inbox', 'Drafts'],
  'p3': ['Inbox'],
  'p4': ['Inbox', 'Sent'],
  'p5': ['Inbox'],
}

Pass renderSubItems to PAProjectTree:

renderSubItems={(projectId) => {
  const labels = mockProjectLabels[projectId] ?? ['Inbox']
  return (
    <div className="flex flex-col">
      {labels.map(label => (
        <button
          key={label}
          className="text-xs text-muted-foreground hover:text-foreground
                     hover:bg-accent/50 px-2 py-0.5 rounded-sm text-left"
        >
          {label}
        </button>
      ))}
    </div>
  )
}}

--- WIRE UP ---

In the left sub-panel where the project tree currently sits, replace
the existing tree JSX with:

<PAProjectTree
  groups={mockProjectGroups}
  selectedProjectId={selectedMailProjectId}
  onProjectSelect={(id) => setSelectedMailProjectId(id)}
  showStatusBadge={false}
  renderSubItems={...as above...}
  className="flex-1 overflow-y-auto"
/>

Add selectedMailProjectId state (useState<string | null>(null)).

Do not change the mail folders sub-panel below, the resize handle between
the two sub-panels, the swap button, or any other part of the MailPage layout.

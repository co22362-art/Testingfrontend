Update src/app/components/ui/PAProjectTree.tsx.

Add two remaining features: status badges and sub-items slot.

--- STATUS BADGE ---

If showStatusBadge prop is true, show a small badge on the right side of each
project row indicating its status.

Badge styles:
- ongoing: text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400
- completed: text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400
- archived: text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400

Badge: text-[10px] px-1.5 py-0.5 rounded-full capitalize font-medium

Project row should be flex justify-between items-center so badge appears on the right.
If showStatusBadge is false or not provided, do not render the badge at all.

--- RENDER SUB-ITEMS SLOT ---

If renderSubItems prop is provided, a selected project row becomes expandable.
Show a small ChevronDown icon on the left of the project name (replace the
indent spacing) to indicate it is expanded.

When a project is selected AND renderSubItems is provided:
- Render the project row as normal
- Immediately below it, render renderSubItems(project.id) wrapped in a div
  with pl-10 indent (or pl-14 if under a category)

Non-selected projects: no toggle icon, no sub-items rendered.

--- FINAL MOCK DATA ---

Replace mockGroups with:

const mockGroups: PAProjectGroup[] = [
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
    ]
  }
]

Use showStatusBadge={true} and selectedProjectId='p1' in preview.
For renderSubItems preview, pass: renderSubItems={(id) => (
  <div className="text-xs text-muted-foreground py-0.5">Label item 1</div>
)}

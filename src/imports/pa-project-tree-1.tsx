Update src/app/components/ui/PAProjectTree.tsx.

Add logic for groups where hasConfidential === true.

--- CATEGORY LOGIC ---

If group.hasConfidential === true, do NOT show projects directly under the group.
Instead show two fixed category rows under the group: "Working" and "Confidential".

Working category: projects where isConfidential === false
Confidential category: projects where isConfidential === true

Only render a category if it has at least one project. If Working has no projects,
skip it. If Confidential has no projects, skip it.

If group.hasConfidential === false, keep existing flat behavior (no change).

--- CATEGORY ROW STYLING ---

- pl-4 indent under the group
- ChevronRight / ChevronDown toggle on the left (small, size-3)
- text-xs text-muted-foreground uppercase tracking-wide label ("Working" / "Confidential")
- For Confidential category: add a Lock icon (size-3, text-muted-foreground) before the label
- Full row clickable to expand/collapse
- Each category starts expanded by default (useState per category per group)
- py-0.5 px-2 hover:bg-accent/30 rounded

Project rows under a category: pl-8 indent (same styling as before)

--- UPDATE MOCK DATA ---

Replace the existing mockGroups with this:

const mockGroups: PAProjectGroup[] = [
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
      { id: 'p5', name: 'Test Project Beta', projectNumber: 'TP-002', status: 'completed', isConfidential: false },
    ]
  }
]

Use selectedProjectId='p1' in preview.

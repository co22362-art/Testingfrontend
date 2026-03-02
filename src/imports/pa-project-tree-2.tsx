Update src/app/components/ui/PAProjectTree.tsx. Three changes:

--- 1. SIMPLIFY TYPOGRAPHY (Outlook-style) ---

Make all rows uniform — same weight, same color, same height. No exceptions.

- Remove font-semibold and font-medium from group, category, year rows.
  Every row: text-sm text-foreground font-normal.
- Category rows (Working/Confidential): remove uppercase, tracking-wide,
  text-muted-foreground. Same text-sm text-foreground as everything else.
- Year rows: same text-sm text-foreground font-normal.
- All folder icons: text-muted-foreground only. No color variation.
- Project number: text-primary font-medium text-sm. Only colored element in the tree.
- Project name: text-sm text-foreground font-normal.
- Status badges: keep colored backgrounds as-is (do not change badges).
- Every row: py-0.5 px-2. Uniform compact height across all levels.
- Selected row: border-l-[3px] border-l-primary bg-accent/40.
- Hover all rows: hover:bg-accent/30.

--- 2. PERSIST EXPANDED STATE ---

Store expand/collapse per node using stable keys (group id, category name,
year number). Default all to true (expanded).

Never reset expand state on re-render, filter change, or selection change.
Once collapsed by user, stays collapsed. Once expanded, stays expanded.

--- 3. MAKE ALL NODES SELECTABLE ---

Add these exported types:

export type PATreeNodeType = 'group' | 'category' | 'year' | 'project'

export interface PATreeNode {
  type: PATreeNodeType
  id: string        // group.id / 'working' / 'confidential' / String(year) / project.id
  groupId: string   // always the parent group id
  label: string
}

Replace props selectedProjectId / onProjectSelect with:
  selectedNode?: PATreeNode | null
  onNodeSelect: (node: PATreeNode) => void

Clicking any row both toggles expand/collapse AND selects it.

onNodeSelect payloads:
- Group:        { type: 'group',    id: group.id,       groupId: group.id, label: group.name }
- Working:      { type: 'category', id: 'working',      groupId: group.id, label: 'Working' }
- Confidential: { type: 'category', id: 'confidential', groupId: group.id, label: 'Confidential' }
- Year:         { type: 'year',     id: String(year),   groupId: group.id, label: String(year) }
- Project:      { type: 'project',  id: project.id,     groupId: group.id, label: project.name }

Selected highlight applies when selectedNode type + id + groupId all match.
This prevents "2025 under IND PROJECTS" highlighting "2025 under IND BUILDINGS".

Update renderSubItems to:
  renderSubItems?: (node: PATreeNode) => React.ReactNode
Only render sub-items when selectedNode matches a project node.

In ProjectsPage and MailPage:
- Replace selectedProjectId state with:
  const [selectedNode, setSelectedNode] = useState<PATreeNode | null>(null)
- Pass: selectedNode={selectedNode} onNodeSelect={node => setSelectedNode(node)}
- Update any logic using selectedProjectId to use selectedNode?.id

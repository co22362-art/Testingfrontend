Create a new page called ProjectsPage.tsx at src/app/modules/3002_projects/ProjectsPage.tsx

This is a projects management page with a resizable left sidebar tree + right detail panel, wrapped inside PAAppLayout.

LAYOUT:
Full-height horizontal flex (no padding):
- Left panel: resizable sidebar (default 300px, min 250px, max 560px), width persisted to localStorage key 'projects-sidebar-width', standard resize handle on right edge
- Right panel: remaining space, bg-background, scrollable

LEFT SIDEBAR:
Use PASidebarHeader component with title="Projects" and no onAdd prop. Wire search to filter tree.

Below PASidebarHeader, add a status filter dropdown BEFORE the tree:
- A full-width button showing currently selected statuses (e.g. "Ongoing" or "Ongoing, Completed"), with a ChevronDown icon on the right
- On click opens a Popover with three checkbox rows:
    ☑ Ongoing     (checked by default)
    ☐ Completed
    ☐ Archived
- User can check/uncheck any combination (at least one must remain checked)
- Button label updates to reflect selections: single = "Ongoing", multiple = "Ongoing, Completed", all three = "All Projects"
- Popover closes when clicking outside

Below the status filter, a scrollable tree (same pattern as TutorialsPage):

TREE STRUCTURE (3 levels):
Level 1 — Project Group (bold, primary color text, collapsible with chevron):
  Level 2 — Year (medium weight, muted, collapsible with chevron, indented 12px):
    Level 3 — Project (leaf, clickable button, indented 24px, Folder icon from lucide-react on left):
      - Project name as button text
      - On click: sets selected project, highlights with primary color text + left border indicator
      - Status badge on the right: small pill — green "Ongoing", blue "Completed", gray "Archived"

MOCK DATA:
  Project Group: "EGIS Infrastructure"
    Year: 2025
      - "25-201_Jordan Phosphate Line UBR-3" (Ongoing)
      - "25-189_Metro Extension Phase 2" (Ongoing)
      - "25-145_Highway Rehabilitation" (Completed)
    Year: 2024
      - "24-312_Bridge Retrofit Project" (Completed)
      - "24-098_Tunnel Assessment" (Archived)
  Project Group: "EGIS Buildings"
    Year: 2025
      - "25-301_Office Tower Dubai" (Ongoing)
      - "25-287_Residential Complex" (Ongoing)
    Year: 2024
      - "24-201_Hospital Wing Extension" (Completed)

Status filter applies to the tree: only show projects matching selected statuses. If a year has no matching projects after filter, hide that year. If a group has no matching years, hide the group.

Auto-expand first Project Group and first Year on load. First project selected by default.

Loading state: skeleton rows in place of tree.
Empty state (no results after filter/search): centered FolderOpen icon + "No projects found" muted text.

RIGHT PANEL — No project selected:
Centered empty state: Folder icon (large, muted) + "Select a project to view details"

RIGHT PANEL — Project selected:
Show selected project name as heading + project group name as muted subheading.

Then a 2-column grid below (gap-4):

LEFT COLUMN — Status Card (Card from shadcn/ui):
- Card header: "Status" title + project name as muted subtitle
- Card body: a placeholder area with dashed border, muted text "Status panel placeholder."

RIGHT COLUMN (stacked, gap-4):

TOP CARD — Team Members:
- Card header row: "Team Members" title + project name muted subtitle on left. On right: a Select (shadcn) with placeholder "Select member" + primary "Add" button (disabled when nothing selected)
- Card body:
  - Loading: skeleton rows
  - Error: red-tinted error message row
  - Empty: muted "No team members assigned."
  - List of members: each row shows avatar initials + member name + a small X (remove) icon button on the right

BOTTOM CARD — Project Managers:
- Same structure as Team Members card but title "Project Managers", select placeholder "Select manager"

MOCK member data for the default selected project:
  Team Members: [{ name: "Aman Singh", initials: "AS" }, { name: "Aditya Mehta", initials: "AM" }]
  Project Managers: [{ name: "Varun Garg", initials: "VG" }]

Use theme tokens throughout. Use lucide-react icons. Use shadcn/ui (Card, Popover, Checkbox, Select, Skeleton, Badge).

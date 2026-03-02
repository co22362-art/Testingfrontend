Create a new page called ProjectGroupPage.tsx at src/app/modules/3011_project_groups/ProjectGroupPage.tsx

This is a project group management page with a resizable two-panel layout wrapped inside PAAppLayout.

LAYOUT STRUCTURE:
Full-height horizontal flex container (no padding) inside PAAppLayout:
- Left panel: resizable sidebar (default 280px, min 250px, max 600px). Width persisted to localStorage key 'project-groups-sidebar-width'. Has a vertical drag handle on its right edge.
- Right panel: takes remaining space, bg-background

LEFT PANEL — Project Groups Sidebar:
- Header row: "Project Groups" title (bold) + Plus icon button (add new group) on the right
- Search input below header with Search icon on the left, placeholder "Search..."
- Scrollable list of project group cards below search. Each card:
  - Left: Avatar circle showing 2-letter initials (e.g. "AB") with a primary-colored gradient background
  - Right: Two lines — group name (bold) on top with an optional orange badge showing a count (only if count > 0), and "Active Users: {n}" in muted small text below
  - Selected card: primary color left border (4px) + subtle primary background tint
  - Hover: bg-accent transition
- Loading state: 4 skeleton rows (shimmer)
- Error state: inline muted error text below search
- Empty state: "No project groups found." centered muted text

DRAG HANDLE:
- 4px wide vertical strip on the right edge of the sidebar
- cursor: col-resize, subtle bg-border color, hover darkens slightly
- On mousedown: track mousemove to resize, clamp between 250-600px, save to localStorage on mouseup
- During drag: set body cursor to col-resize and userSelect to none; restore on mouseup

CREATE PROJECT GROUP MODAL (4-step wizard using Dialog from shadcn/ui):
Modal header shows: "Create Project Group" title + "Step X of 4" subtitle + X close button

Step 1 — Name:
  - Label: "Project Group Name"
  - Text input, placeholder "Enter project group name"

Step 2 — General Directory:
  - Label: "General Directory"
  - Text input, placeholder "Enter general directory path"

Step 3 — Restricted Directory:
  - Row with label "Create Restricted Directory" + a Toggle Switch (shadcn Switch)
  - When toggle is ON: show label "Restricted Directory" + text input for path

Step 4 — Settings Source (radio group):
  - Label: "Use Settings From"
  - Option 1: "Copy from an existing project group" — when selected shows a Select dropdown of existing groups
  - Option 2: "Use a default template" — when selected shows a Select dropdown of templates
  - Option 3: "Blank (no preset settings)" — when selected shows hint "No settings will be copied."
  - Error message shown in red if validation fails

Modal footer:
  - "Back" ghost button (disabled on step 1)
  - "Next" primary button (on last step shows "Create", shows spinner + "Creating..." while submitting)

RIGHT PANEL — Project Group Detail:
When no group selected:
  - Centered empty state: FolderOpen icon (large, muted) + "Select a project group to view settings"

When a group is selected, show the group name as a page heading, then a settings panel with these sections laid out as a vertical list of cards (Card from shadcn/ui):

CARD 1 — General Settings:
  - Title: "General Settings"
  - Toggle rows (label on left, Switch on right) for:
    - "Categorise projects by year" (yearwise_categorise)
    - "Allow project number editing" (allow_project_number_edit)
    - "Classify projects" (classify_projects)
    - "Enable project creation form" (initiate_project_creation_form)
    - "Confidential directory" (confidential_directory)
  - Below toggles: a text input row for "Project Number Format" with current value (e.g. YY-XXZZ) and a small helper text below: "Use YY for year, XX for sequence, ZZ for suffix"

CARD 2 — Module Access:
  - Title: "Module Access"
  - Three toggle rows:
    - "Mail Settings" (allow_mail_settings)
    - "Quality Settings" (allow_quality_settings)
    - "Drawing Settings" (allow_drawing_settings)

CARD 3 — Quality Forms:
  - Title: "Quality Forms"
  - A folder path input (full width) with a placeholder "No folder path set"
  - Muted helper text: "Path to the shared quality forms folder"

Bottom of right panel: a sticky footer bar with "Save Changes" primary button + "Reset" ghost button, only visible when there are unsaved changes.

MOCK DATA:
Project groups list:
  - { name: "EGIS Infrastructure", active_users: 8, badge_count: 2 }
  - { name: "EGIS Buildings", active_users: 5, badge_count: 0 }
  - { name: "EGIS Environment", active_users: 3, badge_count: 1 }

First group selected by default, showing all settings cards with realistic values.

Use theme tokens throughout. Use lucide-react icons. Use shadcn/ui components (Dialog, Switch, Card, Select, Skeleton, Separator).

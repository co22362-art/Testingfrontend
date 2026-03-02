Create a new page called LicensesPage.tsx at src/app/modules/3021_licenses/LicensesPage.tsx

This is an admin license management page using a two-panel WhatsApp-style layout (left sidebar + right content area) wrapped inside PAAppLayout.

LAYOUT STRUCTURE:
The page body (inside PAAppLayout) is a full-height horizontal flex container with no padding:
- Left panel: fixed/resizable width (~280px), has a vertical resize handle on its right edge
- Right panel: takes remaining space

LEFT PANEL — Company List:
- Header row with title "Companies" and a small "Add Company" icon button (Plus icon)
- Search input below the header (full width, searches company names)
- Scrollable list of company cards. Each card shows:
  - Company name (bold)
  - Employee count badge (e.g. "12 employees") in muted text
  - Pending approvals badge — an orange/warning colored dot or pill showing count, only visible when count > 0
  - Three-dot context menu icon on hover revealing: Edit, Delete options
- Selected company card has primary color left border and subtle background highlight
- Empty state: "No companies found" centered text when list is empty

RIGHT PANEL — Company Detail:
When no company is selected:
- Centered empty state with a building/office icon and text: "Select a company to view details"

When a company is selected, the right panel shows two sections stacked vertically:

SECTION 1 — Kill Switches Panel (collapsible, at the top):
- Header row with company name as title, and a chevron toggle button to expand/collapse
- When collapsed: only the header row is visible
- When expanded, shows a list of software rows. Each row has:
  - Software display name (editable inline — clicking a pencil icon makes it an input)
  - Software key in small muted text below the name
  - A toggle switch (ON/OFF) on the right
- Bottom action bar (only visible when expanded and there are unsaved changes):
  - "Save Changes" primary button
  - "Cancel" ghost button
- Loading skeleton when data is loading
- Show a subtle "saving..." spinner on the Save button when saving

SECTION 2 — Employees & Module Access (takes remaining height, scrollable):
This is a horizontal split:

LEFT HALF — Employee Table:
- Toolbar with: "Employees" title, bulk action buttons (Approve Selected, Revoke Selected) that appear only when rows are checked
- When bulk approving: show a date picker inline or in a small popover for "Valid Upto" date
- Table columns: Checkbox | Name | Email | Status (badge: Approved/Pending/Revoked) | Valid Upto date | Actions (Approve / Revoke icon buttons)
- Status badge colors: green for Approved, orange for Pending, red for Revoked
- Loading skeleton rows when loading

RIGHT HALF — Module Access Panel (only visible when an employee is selected):
- Header: selected employee name + close (X) button
- Shows a tree of softwares and their modules that the employee has access to
- Each software is a collapsible group header
- Each module inside is a row with a checkbox or status indicator
- Loading skeleton when loading
- If no employee selected: this half is hidden (left half takes full width)

MODALS (use Dialog component from shadcn/ui):
1. Add Company Modal — fields: Company Name, Admin Email, Admin Name. Primary "Create" button.
2. Edit Company Modal — single field: Company Name. Primary "Save" button.
3. Delete Company Modal — confirmation text showing company name. Destructive "Delete" button + Cancel.

Use mock/static data for all lists. Use theme tokens throughout (no hardcoded colors). Use lucide-react icons. Use shadcn/ui components (Table, Dialog, Switch, Badge, Skeleton, Popover) where appropriate.

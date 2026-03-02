In src/app/modules/3003_mail/MailPage.tsx, redesign the left panel into a smarter sidebar with these changes:

STATE MANAGEMENT:
Add a isMailConnected boolean state (default: false for demo).
Add a leftTopPanel state: 'projects' | 'mail-folders' (default: 'projects') — controls which sub-panel is on top.
Add a topPanelHeight number state (default: 50, as percentage of total sidebar height) — controls the height split.

LEFT SIDEBAR — OVERALL:
The left sidebar remains a single resizable column (same width resize handle on right edge as before). Internally it is split into TWO vertically stacked sub-panels separated by a horizontal drag handle.

SUB-PANEL A (top, height = topPanelHeight%):
SUB-PANEL B (bottom, height = remaining %):

Content of each sub-panel is determined by leftTopPanel state:
- If leftTopPanel === 'projects': top = Project Tree, bottom = Mail Folders
- If leftTopPanel === 'mail-folders': top = Mail Folders, bottom = Project Tree

HORIZONTAL DRAG HANDLE between the two sub-panels:
- h-1.5 (6px tall), full width, bg-border, hover:bg-primary/40, cursor row-resize
- On mousedown: track mousemove to update topPanelHeight percentage (clamped between 20% and 80%)
- On mouseup: restore cursor

SWAP BUTTON:
- A small icon button (ArrowUpDown icon, lucide-react) positioned absolutely on the horizontal drag handle, centered horizontally
- bg-background border border-border rounded-full w-6 h-6 flex items-center justify-center
- On click: toggles leftTopPanel between 'projects' and 'mail-folders'
- Tooltip: "Swap panels"

PROJECT TREE SUB-PANEL:
- Header: "Projects" (font-semibold text-sm, px-3 pt-3 pb-2)
- Search input (same PASidebarHeader search style but compact, h-8 text-xs)
- Scrollable tree identical to ProjectsPage (Project Group → Year → Project with Folder icon + Ongoing/Completed/Archived badge)
- Same mock data as ProjectsPage
- Clicking a project highlights it (primary left border)

MAIL FOLDERS SUB-PANEL — TWO STATES:

State 1 (isMailConnected === false):
- Show Compose button (disabled, muted, not primary color)
- Show folder list (Inbox, Sent, Drafts, Starred, Archive, Trash) as before
- At the very bottom of this sub-panel: a "Connect mailbox" section:
    Small heading: "Connect your mailbox" (text-xs font-semibold text-muted-foreground)
    Subtext: "Use the account that opens in Mail after sign in." (text-xs text-muted-foreground)
    Two buttons side by side:
      "Connect Gmail" (small, outline variant, Mail icon)
      "Connect Outlook" (small, outline variant, Mail icon)
    A demo toggle below (text-xs text-primary underline cursor-pointer): "Preview with connected account →" — clicking sets isMailConnected = true

State 2 (isMailConnected === true):
- Compose button (bg-primary text-primary-foreground, full functionality)
- Folder list with active state highlighting (same as current)
- At the bottom: a small row showing connected account: green dot + "alex@gmail.com" text-xs text-muted-foreground + a small Unlink/X icon button to disconnect (sets isMailConnected = false)

MIDDLE AND RIGHT PANELS:
Unchanged — email list and email content panels remain exactly as they are.

Do not change anything else.

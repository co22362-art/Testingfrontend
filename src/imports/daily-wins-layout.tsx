Update src/app/modules/3010_daily_wins/DailyWinsPage.tsx to add a resizable left sidebar panel (same pattern as ProjectGroupPage), and a Download Logs feature.

OVERALL LAYOUT CHANGE:
Wrap the existing page content in a two-panel horizontal flex layout (same as ProjectGroupPage):
- Left panel: resizable sidebar (default 280px, min 220px, max 480px), width persisted to localStorage key 'daily-wins-sidebar-width', with standard resize handle on the right edge (matching the resize handle style used in ProjectGroupPage)
- Right panel: existing DailyWinsPage content unchanged, takes remaining space, scrollable

LEFT SIDEBAR — Employee List:
Use the PASidebarHeader component (already exists at src/app/components/ui/PASidebarHeader.tsx):
  - title="Daily Wins"
  - No onAdd prop
  - Wire search to filter the employee list by name

Below the header, a scrollable list of employee cards. Each card:
- Full width button, padding px-3 py-3, rounded-lg, hover:bg-accent
- Left: avatar circle with 2-letter initials (bg-primary text-white, w-9 h-9)
- Right of avatar: employee name (font-medium text-sm) on top, designation (text-xs text-muted-foreground) below
- Far right: a "Self" badge (small, outlined, text-xs) ONLY on the currently logged-in user's card
- Far right: a MoreVertical icon button (three dots) on hover or always visible
- Selected card: border border-primary rounded-lg bg-primary/5

MOCK DATA for employee list (first item is "Self"):
  { name: "Varun Garg",      designation: "Senior Designer",       isSelf: true  }
  { name: "Amrit Dhiman",    designation: "Junior Drafter",        isSelf: false }
  { name: "Aman Singh",      designation: "Engineer",              isSelf: false }
  { name: "Aditya Mehta",    designation: "Junior Designer",       isSelf: false }
  { name: "Aaryan Sehgal",   designation: "Junior Designer",       isSelf: false }
  { name: "Shubham Rastogi", designation: "Intermediate Designer", isSelf: false }
  { name: "Manjot Singh",    designation: "Junior Designer",       isSelf: false }
  { name: "Tarun Garg",      designation: "Senior Drafter",        isSelf: false }
  { name: "Abhinav Heera",   designation: "Junior Designer",       isSelf: false }

Self employee is selected and highlighted by default.

THREE-DOT MENU (MoreVertical button on each card):
On click, show a small Popover/DropdownMenu with a single option: "Download Logs" (with a Download icon from lucide-react).

DOWNLOAD LOGS POPOVER:
When "Download Logs" is clicked from the dropdown, close the dropdown and open a separate Popover anchored to the three-dot button showing:
- Title row: Download icon + "Download Logs" text (font-semibold)
- FROM label + date input (type="date", full width, default to first day of current month)
- TO label + date input (type="date", full width, default to today)
- "Download Logs" primary button (full width, bg-primary text-white)

Do not change the existing right panel content. Do not change anything else.

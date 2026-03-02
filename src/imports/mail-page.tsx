Create a new page called MailPage.tsx at src/app/modules/3003_mail/MailPage.tsx

Use the following implementation as the base, but adapt it fully to the app's design system: wrap it in PAAppLayout, replace all hardcoded indigo/slate colors with theme tokens, and use the existing UI patterns.

STRUCTURE (3-panel layout inside PAAppLayout, full height, no padding):

PANEL 1 — Folders Sidebar (w-44, border-r border-border, bg-sidebar):
- "Compose" button at top: full width minus margin, bg-primary text-primary-foreground, Edit3 icon, rounded-lg
- Folder list (Inbox with count 4, Sent, Drafts with count 2, Starred, Archive, Trash) — active folder: bg-primary/10 text-primary border-r-2 border-primary, inactive: text-muted-foreground hover:bg-accent
- Labels section below with heading "Labels" (text-xs uppercase muted): project, approval, team, billing, report — each with a Tag icon and colored dot

PANEL 2 — Email List (w-72, border-r border-border, bg-card, flex-col):
- Search bar at top (Search icon + input, bg-secondary, border-border, rounded-lg)
- Scrollable email list. Each email row:
  - Avatar circle (initials, use bg-primary/10 text-primary instead of hardcoded colors)
  - Sender name (font-semibold if unread, text-foreground)
  - Time (text-muted-foreground text-xs)
  - Subject line (font-medium if unread)
  - Preview text (text-muted-foreground truncate)
  - Bottom row: unread dot (bg-primary), tag pill, attachment count
  - Selected: bg-primary/5 border-l-2 border-l-primary
  - Hover: bg-accent

PANEL 3 — Email Content (flex-1, bg-background):
- Toolbar: Reply (bg-primary text-primary-foreground), Forward (border border-border), then Archive, Trash2, MoreHorizontal icon buttons (text-muted-foreground hover:bg-accent)
- Email body (scrollable, p-6):
  - Subject as h2 (text-foreground, font-semibold)
  - Sender row: avatar + name + email + time
  - "to me" chevron button (text-muted-foreground)
  - Body paragraphs (text-foreground text-sm leading-relaxed)
  - Attachments section (border-t border-border): file cards with bg-secondary border-border FileText icon in text-primary
- Reply box (border-t border-border):
  - Textarea in rounded-xl border-border focus-within:border-primary
  - Paperclip icon button
  - "Send Reply" button (bg-primary text-primary-foreground)

MOCK DATA (same as provided):
  Use all 6 emails as provided. Tag colors should use theme-safe classes:
    project: bg-primary/10 text-primary
    approval: bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400
    team: bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400
    billing: bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400
    report: bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400

Default selected email: first email (Alex Rodriguez).
Default active folder: Inbox.

Use theme tokens throughout for all backgrounds, borders, and text. Use lucide-react icons. Do not use any hardcoded indigo or slate color classes.

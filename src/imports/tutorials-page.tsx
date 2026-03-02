Create a new page called TutorialsPage.tsx at src/app/modules/3013_tutorials/TutorialsPage.tsx

This is a video tutorials page with a resizable two-panel layout wrapped inside PAAppLayout.

LAYOUT STRUCTURE:
Full-height horizontal flex container (no padding) inside PAAppLayout:
- Left panel: resizable sidebar (default 320px, min 220px, max 600px). Width persisted to localStorage key 'videoSidebarWidth'. Has a vertical drag handle on its right edge (4px wide, cursor col-resize, subtle hover highlight).
- Right panel: takes all remaining space, dark background (bg-black or bg-zinc-950)

LEFT PANEL — Video Tree Sidebar:
- Header: "Tutorials" title in bold, full-width, with a subtle bottom border
- Scrollable tree list below the header
- Tree is 3 levels deep: Software → Module → Video

Tree node rendering rules:
- All nodes have a +/- chevron/toggle button on the left when they have children. No toggle spacer needed for leaf nodes.
- SOFTWARE nodes (level 0): Bold text, primary color label, acts as a collapsible group header. No left indent.
- MODULE nodes (level 1): Medium weight text, muted color. Indented 12px from parent.
- VIDEO nodes (level 2, leaf): Rendered as a clickable button. Indented 24px from root. Shows a Play icon (small, lucide-react) to the left of the title. On hover: subtle bg highlight. When selected/active: primary color text + primary color left border indicator.

States:
- Loading: show 6 skeleton rows (shimmer) in place of the tree
- Error: centered icon (AlertCircle) + "Error Loading Videos" heading + error message text + a Retry button
- Empty: centered Video icon + "No videos available" muted text

RIGHT PANEL — Video Player:
- When no video is selected: centered empty state with a Play circle icon (large, muted) and text "Select a tutorial to start watching"
- When a video is selected:
  - Full width/height iframe with no border (border-0)
  - allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
  - Below the iframe (or overlaid at bottom): a slim info bar showing the selected video's title, software name and module name as breadcrumb text (e.g. "ProjectAssist › People › Getting Started")

MOCK DATA for the tree (use this structure):
  Software: "ProjectAssist"
    Module: "People"
      Video: "Getting Started with People" (provider: googledrive, url: "https://drive.google.com/file/d/example1/preview")
      Video: "Managing Employee Records" (provider: googledrive, url: "https://drive.google.com/file/d/example2/preview")
    Module: "Time Sheets"
      Video: "How to Submit a Timesheet" (provider: synthesia, url: "https://share.synthesia.io/embeds/videos/example3")
  Software: "CAD Manager"
    Module: "Drawings"
      Video: "Uploading CAD Files" (provider: googledrive, url: "https://drive.google.com/file/d/example4/preview")

RESIZE BEHAVIOUR:
On mousedown on the drag handle:
- Disable pointer events on the iframe during drag (to prevent iframe stealing mouse events)
- Track mousemove to update sidebar width (clamped between 220 and 600)
- Re-enable pointer events on mouseup
- Save width to localStorage on change

Use theme tokens throughout (no hardcoded colors). Use lucide-react icons. Use Skeleton from shadcn/ui for loading state.

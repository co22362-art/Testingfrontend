# Project Assist — Figma AI Guidelines

> **CRITICAL ARCHITECTURE RULE:**
> The entire frontend is being built from scratch in Figma. Figma is the single source of truth for all UI. All components are TypeScript (`.tsx`). 
> **Figma Make ONLY handles UI. It NEVER handles logic, fetching, or routing.**

---

# 1. Engineering & Architecture Rules

1. **Strictly Prop-Driven:** All page components and UI components MUST be fully prop-driven. They receive data, they emit events (like `onClick`, `onSubmit`). They do nothing else.
2. **No Data Fetching:** **NEVER** include `fetch()`, `axios`, `useEffect` for data loading, or any API calls inside generated components. The engineering team will wrap these components in a separate `connected/` directory to provide data.
3. **Mock Data Only:** Use mock data only as default prop values for preview purposes.
4. **Safe Zones (Hands-Off):** Do NOT modify `src/main.tsx`, `vite.config.ts`, or anything inside `src/connected/` or `src/services/`.
5. **Output Directory:** Place all generated pages strictly in `src/app/modules/`. Place shared UI components in `src/app/components/`.

---

# 2. General UI Guidelines

* Use flexbox and grid by default. Avoid absolute positioning except for overlays, tooltips, and dropdowns.
* Design mobile-aware but desktop-first. Primary breakpoint is 1440px, secondary is 1024px.
* Use an 8pt spacing grid throughout. Only use these spacing values: 4, 8, 12, 16, 24, 32, 48, 64px.
* Every screen must have a loading state and an empty state variant.
* Keep components modular — no one-off styles. If a pattern appears twice, it becomes a component.
* Layer and component names must match React component names exactly. All components are TypeScript (.tsx) files.
* Refactor and clean up as you go. Do not leave orphaned layers or hidden elements.
* All components must support Light and Dark theme variants using the token system defined below.

---

# 3. Theme System & Tokens

**Rule:** Never hardcode hex values in a component. Always reference a semantic token (e.g. `className="bg-background-primary text-brand-primary"`).

## Token Naming Convention
* `color/background/primary`, `color/background/secondary`, `color/background/sidebar`, `color/background/card`, `color/background/hover`
* `color/text/primary`, `color/text/secondary`, `color/text/muted`, `color/text/inverse`
* `color/border/default`, `color/border/focus`
* `color/brand/primary`, `color/brand/hover`, `color/brand/subtle`
* `color/status/success`, `color/status/warning`, `color/status/error`, `color/status/info`

## Theme Rules
* Every component must be designed in both Light and Dark mode.
* Sidebar background stays dark (`color/background/sidebar`) in both themes.
* Brand Amber (`#F59E0B`) is consistent across both themes as the primary accent.
* Shadows become more subtle in dark mode — use opacity-based shadows, not hardcoded colors.

---

# 4. Design System Guidelines

## Typography
* Base font size: 14px. Line height: 1.5.
* Font scale (strict): 12px, 14px, 16px, 18px, 20px, 24px, 30px. No arbitrary sizes.
* Headings: Semibold (600). Body: Regular (400). Labels and captions: Medium (500).

## Spacing & Layout
* Sidebar width: 240px expanded, 64px collapsed.
* Top navbar height: 56px.
* Page content max-width: 1280px, centered with 24px horizontal padding.
* Card padding: 16px (compact) or 24px (default). Never mix within the same view.
* Section spacing between page blocks: 32px.

## Border Radius
* sm: 4px — tags, badges
* md: 8px — inputs, buttons, cards
* lg: 12px — modals, drawers, larger cards
* xl: 16px — feature panels

## Buttons
* One primary (`color/brand/primary` filled) button per section maximum.
* Secondary: `color/border/default` outlined, transparent background.
* Tertiary: text-only, no border, `color/text/secondary`.
* Destructive: `color/status/error` filled. Never use Amber for destructive actions.
* Heights: 36px default, 32px compact, 44px large.
* Loading state: replace label with a spinner, keep button width fixed.

## Forms & Inputs
* Label always above the input. Never use placeholder as a label substitute.
* Required fields marked with * in `color/brand/primary`.
* Validation errors below the field in `color/status/error` at 12px.
* Input height: 40px across all form types.
* Related fields: 16px gap. Field groups: 24px gap.

## Tables
* Row height: 48px default, 40px compact.
* Sticky header on all scrollable tables.
* Empty state: icon + message + CTA.
* Column headers: `color/text/muted`, 12px, uppercase, letter-spacing 0.05em.

## Modals & Dialogs
* Widths: sm=400px, md=560px, lg=720px. Full-screen for complex multi-step forms.
* Always include Cancel + clearly labeled confirm action.
* Confirmation modal required for all irreversible or destructive actions.

---

# 5. Project Structure & Page Organization

## Module Numbering Convention
All modules follow a 4-digit prefix in the 3000-range. New modules continue the sequence. Never reuse or skip numbers.

| ID   | Module Name        | Route                | Primary File      |
|------|--------------------|----------------------|-------------------|
| 3000 | User Login         | /login               | SignIn.tsx        |
| 3001 | Homepage           | /dashboard           | HomeDashboard.tsx |
| 3002 | Projects           | /projects            | index.tsx         |
| 3003 | Mails              | /mails               | index.tsx         |
| 3004 | CAD Manager        | /cad-manager         | index.tsx         |
| 3005 | Time Sheets        | /time-sheets         | index.tsx         |
| 3010 | Daily Wins         | /daily-wins          | index.tsx         |
| 3011 | Project Groups     | /project-groups      | index.tsx         |
| 3012 | People             | /people              | index.tsx         |
| 3013 | Tutorials          | /tutorials           | index.tsx         |
| 3016 | Form Builder       | /form-builder        | index.tsx         |
| 3021 | License Management | /license-management  | index.tsx         |

## Within Each Module Page (frame order)
1. Default / Main State — Light Theme
2. Default / Main State — Dark Theme
3. Loading State
4. Empty State
5. Error State
6. Create / Edit Modal or Drawer (if applicable)

## Component Naming
* Module-scoped: prefixed with module name — e.g., `Projects/ProjectCard.tsx`
* Shared: live in Components page, no module prefix
* Names must match the `.tsx` filename exactly.

---

# 6. Frontend ↔ Figma Traceability

```text
Figma Page              →  Module Folder                    →  Route                →  RPC Prefix
3000 · Login            →  src/modules/3000_user_login      →  /login               →  auth_*
3001 · Homepage         →  src/modules/3001_homepage        →  /dashboard           →  dash_*
3002 · Projects         →  src/modules/3002_projects        →  /projects            →  pg_projects_*
3003 · Mails            →  src/modules/3003_mails           →  /mails               →  mail_*
3004 · CAD Manager      →  src/modules/3004_cad_manager     →  /cad-manager         →  cad_*
3005 · Time Sheets      →  src/modules/3005_time_sheets     →  /time-sheets         →  ts_*
3010 · Daily Wins       →  src/modules/3010_daily_wins      →  /daily-wins          →  dw_*
3011 · Project Groups   →  src/modules/3011_project_groups  →  /project-groups      →  project_group_*
3012 · People           →  src/modules/3012_people          →  /people              →  employee_*
3013 · Tutorials        →  src/modules/3013_tutorials       →  /tutorials           →  tut_*
3016 · Form Builder     →  src/modules/3016_form_builder    →  /form-builder        →  form_*
3021 · License Mgt      →  src/modules/3021_license         →  /license-management  →  lic_*
```
Every layer uses the same identity. A design change traces from Figma → `.tsx` → service → Edge Function → RPC without ambiguity.

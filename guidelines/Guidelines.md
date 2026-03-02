# Project Assist — Figma AI Guidelines

> **CRITICAL ARCHITECTURE RULE:**
> The entire frontend is being built from scratch in Figma. Figma is the single source of truth for all UI. All components are TypeScript (`.tsx`).
> **Figma Make ONLY handles UI. It NEVER handles logic, data fetching, or routing.**

---

# 1. Engineering & Architecture Rules

1. **Strictly Prop-Driven:** All page and UI components MUST be fully prop-driven. They receive data, they emit events (`onClick`, `onSubmit`). They do nothing else.
2. **No Data Fetching:** NEVER include `fetch()`, `axios`, `useEffect` for data loading, or any API calls inside generated components. The engineering team wraps these in a separate `connected/` directory.
3. **Mock Data Only:** Use mock data only as default prop values for preview purposes.
4. **Safe Zones (Hands-Off):** Do NOT modify `src/main.tsx`, `vite.config.ts`, or anything inside `src/connected/` or `src/services/`.
5. **Output Directory:** Place all generated pages in `src/app/modules/`. Place shared UI components in `src/app/components/`.
6. **No Hardcoded Colors:** Never hardcode hex values in a component. Always reference a semantic token (e.g. `className="bg-background-primary text-brand-primary"`).

---

# 2. General UI Guidelines

* Use flexbox and grid by default. Avoid absolute positioning except for overlays, tooltips, and dropdowns.
* Design mobile-aware but desktop-first. Primary breakpoint is 1440px, secondary is 1024px.
* Use an 8pt spacing grid throughout. Only use these spacing values: 4, 8, 12, 16, 24, 32, 48, 64px.
* Every screen must have a loading state and an empty state variant.
* Keep components modular — no one-off styles. If a pattern appears twice, it becomes a component.
* Layer and component names must match React component names exactly. All components are TypeScript (`.tsx`) files.
* Refactor and clean up as you go. Do not leave orphaned layers or hidden elements.
* All components must support Light and Dark theme variants using the token system defined below.

---

# 3. Theme System & Tokens

## Token Naming Convention

```
color/background/primary      color/text/primary
color/background/secondary    color/text/secondary
color/background/sidebar      color/text/muted
color/background/card         color/text/inverse
color/background/hover        color/border/default
                              color/border/focus
color/brand/primary           color/status/success
color/brand/hover             color/status/warning
color/brand/subtle            color/status/error
                              color/status/info
```

## Token Values

| Token                      | Light Mode | Dark Mode  |
|----------------------------|------------|------------|
| color/background/primary   | #FFFFFF    | #0F172A    |
| color/background/secondary | #F8FAFC    | #1E293B    |
| color/background/sidebar   | #0F172A    | #020617    |
| color/background/card      | #FFFFFF    | #1E293B    |
| color/background/hover     | #F1F5F9    | #334155    |
| color/text/primary         | #0F172A    | #F8FAFC    |
| color/text/secondary       | #334155    | #CBD5E1    |
| color/text/muted           | #64748B    | #64748B    |
| color/text/inverse         | #F8FAFC    | #0F172A    |
| color/border/default       | #E2E8F0    | #334155    |
| color/border/focus         | #F59E0B    | #F59E0B    |
| color/brand/primary        | #F59E0B    | #F59E0B    |
| color/brand/hover          | #D97706    | #FBBF24    |
| color/brand/subtle         | #FEF3C7    | #292524    |
| color/status/success       | #22C55E    | #4ADE80    |
| color/status/warning       | #FBBF24    | #FCD34D    |
| color/status/error         | #EF4444    | #F87171    |
| color/status/info          | #3B82F6    | #60A5FA    |

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
* Text colors always use tokens: primary → `color/text/primary`, muted → `color/text/muted`.

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
* Never use arbitrary radius values.

## Shadows

* Subtle: card resting state. Medium: dropdowns, popovers. Strong: modals, overlays.
* Never hardcode shadow colors. Use Slate-900 at low opacity.

## Buttons

* One primary (`color/brand/primary` filled) button per section maximum.
* Secondary: `color/border/default` outlined, transparent background.
* Tertiary: text-only, no border, `color/text/secondary`.
* Destructive: `color/status/error` filled. Never use Amber for destructive actions.
* Heights: 36px default, 32px compact, 44px large.
* Never use an icon-only button without a tooltip.
* Loading state: replace label with a spinner, keep button width fixed.

## Forms & Inputs

* Label always above the input. Never use placeholder as a label substitute.
* Required fields marked with `*` in `color/brand/primary`.
* Validation errors below the field in `color/status/error` at 12px.
* Input height: 40px across all form types.
* Input background: `color/background/card`. Border: `color/border/default`. Focus: `color/border/focus`.
* Use radio or toggle for 2 options. Dropdown only for 3 or more options.
* Related fields: 16px gap. Field groups: 24px gap.

## Tables

* Row height: 48px default, 40px compact.
* Sticky header on all scrollable tables.
* Empty state: icon + message + CTA.
* Row actions: max 3 inline icons, rest in kebab (⋮) menu.
* Column headers: `color/text/muted`, 12px, uppercase, letter-spacing 0.05em.
* Row background: `color/background/card`. Hover: `color/background/hover`.

## Navigation

* Sidebar is the only primary nav. No bottom toolbar on desktop.
* Active nav item: `color/brand/primary` left border (3px) + `color/brand/subtle` background.
* Hover: `color/background/hover`.
* Breadcrumbs required on pages deeper than 2 levels.
* Sidebar section labels: 11px, `color/text/muted`, uppercase, letter-spacing 0.08em.

## Status & Badges

* Pill shape (rounded-full) always. Never square badges.
* Active → `color/status/success`. On Hold → `color/status/warning`. Completed → `color/text/muted`. Cancelled → `color/status/error`.
* Always pair color with a text label. Never use color alone for status.
* Badge font size: 12px Medium.

## Modals & Dialogs

* Widths: sm=400px, md=560px, lg=720px. Full-screen for complex multi-step forms.
* Always include Cancel + clearly labeled confirm action.
* Destructive confirm: `color/status/error`, never `color/brand/primary`.
* Confirmation modal required for all irreversible or destructive actions.
* Overlay: `color/background/sidebar` at 60% opacity.
* Modal: center scale + fade. Drawer: slide from right.

## Icons

* Single icon library only. Do not mix icon sets.
* 16px inline with text, 20px standalone actions, 24px empty states.
* Always pair with a label or tooltip. Icon color inherits from surrounding text token.

---

# 5. Figma Page Organization

## File Pages (in order)

1. 🎨 Tokens & Variables
2. 🧱 Components
3. 3000 · Login
4. 3001 · Homepage
5. 3002 · Projects
6. 3003 · Mails
7. 3004 · CAD Manager
8. 3005 · Time Sheets
9. 3010 · Daily Wins
10. 3011 · Project Groups
11. 3012 · People
12. 3013 · Tutorials
13. 3016 · Form Builder
14. 3021 · License Management
15. 🗂 Archive

## Within Each Module Page (frame order)

1. Default / Main State — Light Theme
2. Default / Main State — Dark Theme
3. Loading State
4. Empty State
5. Error State
6. Create / Edit Modal or Drawer (if applicable)
7. 1024px variant (if layout differs significantly)

## Component Naming

* Module-scoped: prefixed with module name — e.g. `Projects/ProjectCard.tsx`
* Shared: live in 🧱 Components page, no module prefix
* Names must match the `.tsx` filename exactly

---

# 6. Module Component Inventory

All screens below must be fully designed with Light + Dark variants.

## 3000 · Login

* `LoginPage.tsx` — email + password, forgot password link, sign in CTA
* `ResetPasswordPage.tsx` — email input, send reset link CTA
* `ChangePasswordPage.tsx` — old + new + confirm password fields
* `AboutPage.tsx` — product info page

## 3001 · Homepage

* `DashboardPage.tsx` — shell with sidebar + navbar layout
* `HomeDashboard.tsx` — stats panels, summary widgets
* `RecentUpdates.tsx` — scrollable activity/update feed
* `GettingStarted.tsx` — onboarding welcome screen for new users

## 3002–3021 · Remaining Modules

Each module requires at minimum:
* List / Overview screen
* Detail / Expanded view
* Create / Edit modal or drawer
* Empty state
* Loading state

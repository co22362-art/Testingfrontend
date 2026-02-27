# Project Assist — File Structure

> All generated pages go in `src/app/modules/`. All shared UI components go in `src/app/components/`.
> Module folders use the 4-digit prefix convention (e.g. `3002_projects/`) to match Figma page numbering exactly.

---

## Full Structure

```
src/
└── app/
    ├── components/                        # Global/shared components only
    │   ├── ui/                            # Reusable UI primitives
    │   │   ├── Button.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Table.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Drawer.tsx
    │   │   ├── Tooltip.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── LoadingState.tsx
    │   ├── PAAppLayout.tsx                # Main layout: sidebar + navbar
    │   └── PACard.tsx                     # Shared card component
    │
    ├── modules/
    │   ├── 3000_user_login/               # 3000 · Login
    │   │   ├── LoginPage.tsx
    │   │   ├── ResetPasswordPage.tsx
    │   │   ├── ChangePasswordPage.tsx
    │   │   └── AboutPage.tsx
    │   │
    │   ├── 3001_homepage/                 # 3001 · Homepage
    │   │   ├── DashboardPage.tsx
    │   │   └── components/
    │   │       ├── HomeDashboard.tsx
    │   │       ├── RecentUpdates.tsx
    │   │       └── GettingStarted.tsx
    │   │
    │   ├── 3002_projects/                 # 3002 · Projects
    │   │   ├── ProjectsPage.tsx
    │   │   └── components/
    │   │       ├── ProjectCard.tsx
    │   │       ├── ProjectStatusBadge.tsx
    │   │       ├── ProjectFilters.tsx
    │   │       └── CreateProjectModal.tsx
    │   │
    │   ├── 3003_mails/                    # 3003 · Mails
    │   │   ├── MailsPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3004_cad_manager/              # 3004 · CAD Manager
    │   │   ├── CadManagerPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3005_time_sheets/              # 3005 · Time Sheets
    │   │   ├── TimeSheetsPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3010_daily_wins/               # 3010 · Daily Wins
    │   │   ├── DailyWinsPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3011_project_groups/           # 3011 · Project Groups
    │   │   ├── ProjectGroupsPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3012_people/                   # 3012 · People
    │   │   ├── PeoplePage.tsx
    │   │   └── components/
    │   │       └── GroupPermissionsModal.tsx
    │   │
    │   ├── 3013_tutorials/                # 3013 · Tutorials
    │   │   ├── TutorialsPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3016_form_builder/             # 3016 · Form Builder
    │   │   ├── FormBuilderPage.tsx
    │   │   └── components/
    │   │
    │   ├── 3021_license_management/       # 3021 · License Management
    │   │   ├── LicenseManagementPage.tsx
    │   │   └── components/
    │   │
    │   └── errors/
    │       └── NotFoundPage.tsx
    │
    ├── styles/
    │   ├── fonts.css
    │   └── theme.css
    │
    ├── App.tsx
    └── routes.tsx
```

---

## Module Self-Containment Rules

* **Global components** → `src/app/components/` — used across multiple modules (e.g. `PAAppLayout`, `PACard`, all `ui/` primitives)
* **Module components** → `src/app/modules/3XXX_name/components/` — used only within that module
* Each module may also have:
  * `hooks/` — module-specific React hooks
  * `types/` — module-specific TypeScript interfaces and types
* Modules never import directly from other modules. Cross-module data flows through shared services only.

---

## Module Map

| Figma Page            | Code Folder                  | Route                | RPC Prefix      |
|-----------------------|------------------------------|----------------------|-----------------|
| 3000 · Login          | 3000_user_login/             | /login               | auth_*          |
| 3001 · Homepage       | 3001_homepage/               | /dashboard           | dash_*          |
| 3002 · Projects       | 3002_projects/               | /projects            | pg_projects_*   |
| 3003 · Mails          | 3003_mails/                  | /mails               | mail_*          |
| 3004 · CAD Manager    | 3004_cad_manager/            | /cad-manager         | cad_*           |
| 3005 · Time Sheets    | 3005_time_sheets/            | /time-sheets         | ts_*            |
| 3010 · Daily Wins     | 3010_daily_wins/             | /daily-wins          | dw_*            |
| 3011 · Project Groups | 3011_project_groups/         | /project-groups      | project_group_* |
| 3012 · People         | 3012_people/                 | /people              | employee_*      |
| 3013 · Tutorials      | 3013_tutorials/              | /tutorials           | tut_*           |
| 3016 · Form Builder   | 3016_form_builder/           | /form-builder        | form_*          |
| 3021 · License Mgt    | 3021_license_management/     | /license-management  | lic_*           |

---

## Routing (`src/app/routes.tsx`)

```typescript
import { createBrowserRouter, Outlet } from 'react-router';
import NotFoundPage               from './modules/errors/NotFoundPage';
import LoginPage                  from './modules/3000_user_login/LoginPage';
import DashboardPage              from './modules/3001_homepage/DashboardPage';
import ProjectsPage               from './modules/3002_projects/ProjectsPage';
import MailsPage                  from './modules/3003_mails/MailsPage';
import CadManagerPage             from './modules/3004_cad_manager/CadManagerPage';
import TimeSheetsPage             from './modules/3005_time_sheets/TimeSheetsPage';
import DailyWinsPage              from './modules/3010_daily_wins/DailyWinsPage';
import ProjectGroupsPage          from './modules/3011_project_groups/ProjectGroupsPage';
import PeoplePage                 from './modules/3012_people/PeoplePage';
import TutorialsPage              from './modules/3013_tutorials/TutorialsPage';
import FormBuilderPage            from './modules/3016_form_builder/FormBuilderPage';
import LicenseManagementPage      from './modules/3021_license_management/LicenseManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true,                    Component: LoginPage },
      { path: 'dashboard',              Component: DashboardPage },
      { path: 'projects',               Component: ProjectsPage },
      { path: 'mails',                  Component: MailsPage },
      { path: 'cad-manager',            Component: CadManagerPage },
      { path: 'time-sheets',            Component: TimeSheetsPage },
      { path: 'daily-wins',             Component: DailyWinsPage },
      { path: 'project-groups',         Component: ProjectGroupsPage },
      { path: 'people',                 Component: PeoplePage },
      { path: 'tutorials',              Component: TutorialsPage },
      { path: 'form-builder',           Component: FormBuilderPage },
      { path: 'license-management',     Component: LicenseManagementPage },
      { path: '*',                      Component: NotFoundPage },
    ],
  },
]);
```

---

## Adding a New Module

1. Create folder: `src/app/modules/3XXX_module_name/`
2. Add main page: `3XXX_module_name/{Name}Page.tsx`
3. Add `components/`, `hooks/`, `types/` subfolders as needed
4. Register route in `src/app/routes.tsx`
5. Add nav entry in `src/app/components/PAAppLayout.tsx`
6. Create corresponding Figma page: `3XXX · Module Name`
7. Keep Figma page number and folder prefix in sync always

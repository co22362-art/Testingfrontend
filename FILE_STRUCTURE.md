# Project Assist - File Structure

## Clean Modular Architecture (TypeScript)

```
src/
└── app/
    ├── components/              # Shared/Global components only
    │   ├── figma/              # Figma-specific components
    │   ├── ui/                 # Reusable UI components
    │   │   └── PACard.tsx
    │   └── PAAppLayout.tsx     # Main layout with sidebar
    │
    ├── modules/                # ALL features here! 🎯
    │   ├── auth/
    │   │   └── LoginPage.tsx
    │   │
    │   ├── dashboard/
    │   │   └── DashboardPage.tsx
    │   │
    │   ├── daily-wins/
    │   │   └── DailyWinsPage.tsx
    │   │
    │   ├── errors/
    │   │   └── NotFoundPage.tsx
    │   │
    │   └── people/
    │       ├── PeoplePage.tsx
    │       └── components/      # Module-specific components
    │           └── GroupPermissionsModal.tsx
    │
    ├── styles/                  # Global styles
    │   ├── fonts.css
    │   └── theme.css
    │
    ├── App.tsx                  # Main app component
    └── routes.tsx               # Router configuration (root level)
```

## Key Principles

### ✅ No Separate Pages Folder
- ❌ OLD: Separate `pages/` folder with Root, LoginPage, etc.
- ✅ NEW: Everything organized in `modules/` by feature
- **Root component**: Inlined directly in `routes.tsx`
- **routes.tsx**: Lives at root level `/src/app/routes.tsx`

### ✅ Module Self-Containment
Each module is **completely self-contained** with:
- **Main page** (e.g., `PeoplePage.tsx`)
- **Module-specific components** in `components/` subfolder
- **Module-specific logic, types, and utilities**

### ✅ Component Organization
- **Global components** → `/src/app/components/`
  - Used across multiple modules
  - Example: `PAAppLayout`, `PACard`
  
- **Module components** → `/src/app/modules/{module}/components/`
  - Used only within that specific module
  - Example: `GroupPermissionsModal` only in `people` module

## Module Structure Examples

### People Module
```
modules/people/
├── PeoplePage.tsx                    # Main page
└── components/                       # Module-specific components
    └── GroupPermissionsModal.tsx     # Used only in this module
```

### Auth Module
```
modules/auth/
└── LoginPage.tsx                     # Main page
```

### Errors Module
```
modules/errors/
└── NotFoundPage.tsx                  # 404 page
```

### Future Module Example (Projects)
```
modules/projects/
├── ProjectsPage.tsx                  # Main page
├── components/                       # Module-specific components
│   ├── ProjectCard.tsx
│   ├── ProjectFilters.tsx
│   └── CreateProjectModal.tsx
├── hooks/                           # Module-specific hooks (optional)
│   └── useProjects.ts
└── types/                           # Module-specific types (optional)
    └── project.types.ts
```

## Routing Structure

### routes.tsx (Root Level)
```typescript
import { createBrowserRouter, Outlet } from 'react-router';
import NotFoundPage from './modules/errors/NotFoundPage';
import LoginPage from './modules/auth/LoginPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import DailyWinsPage from './modules/daily-wins/DailyWinsPage';
import PeoplePage from './modules/people/PeoplePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: () => <Outlet />,      // Inline Root component
    errorElement: <NotFoundPage />,
    children: [
      { index: true, Component: LoginPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'daily-wins', Component: DailyWinsPage },
      { path: 'people', Component: PeoplePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
```

### Routes:
```
/              → LoginPage (modules/auth/)
/dashboard     → DashboardPage (modules/dashboard/)
/daily-wins    → DailyWinsPage (modules/daily-wins/)
/people        → PeoplePage (modules/people/)
/*             → NotFoundPage (modules/errors/)
```

## Benefits of This Structure

### 🎯 **Perfect Modularity**
- Each module is a mini-application
- Easy to find everything related to a feature
- Clear boundaries between features
- No unnecessary folders

### 🔧 **Easy Maintenance**
- All related code in one place
- Change one module without affecting others
- Delete a module by removing its folder
- Routes in one central file at root level

### 📦 **Scalable**
- Add new modules without restructuring
- Modules can have their own substructure
- No confusion about where components go
- Clean, flat top-level structure

### 🚀 **Better Developer Experience**
```
Need to work on People Management?
→ Go to modules/people/
→ Everything you need is there!

Need to add a route?
→ Go to routes.tsx at root level
→ Add your route!

Need to see the app structure?
→ Look at /src/app/
→ Only 4 folders: components, modules, styles, + routes.tsx!
```

## When to Create Module Components vs Global Components?

### Create in `modules/{module}/components/` when:
- ✅ Component used ONLY in that module
- ✅ Component has module-specific logic
- ✅ Component depends on module-specific types
- **Example**: `GroupPermissionsModal` → Only used in People

### Create in `components/` when:
- ✅ Component used across MULTIPLE modules
- ✅ Component is truly generic/reusable
- ✅ Component has no module-specific logic
- **Example**: `PACard`, `PAAppLayout` → Used everywhere

## Adding a New Module

To add a new module (e.g., "Tasks"):

1. **Create module folder**:
   ```
   mkdir -p src/app/modules/tasks/components
   ```

2. **Create main page**:
   ```typescript
   // src/app/modules/tasks/TasksPage.tsx
   import PAAppLayout from '../../components/PAAppLayout';
   
   export default function TasksPage() {
     return (
       <PAAppLayout activePage="tasks">
         {/* Your content */}
       </PAAppLayout>
     );
   }
   ```

3. **Add route** in `/src/app/routes.tsx`:
   ```typescript
   import TasksPage from './modules/tasks/TasksPage';
   
   // Inside children array:
   { path: 'tasks', Component: TasksPage }
   ```

4. **Add navigation** (if needed) in `/src/app/components/PAAppLayout.tsx`:
   ```typescript
   { id: 'tasks', icon: CheckSquare, path: '/tasks', label: 'Tasks' }
   ```

## Clean Structure Achieved! 🎉

### File Structure:
```
/src/app/
├── components/         # Global only
├── modules/           # All features
├── styles/            # Global styles
├── App.tsx           # Entry point
└── routes.tsx        # Routing (ROOT LEVEL!)
```

### What We Removed:
❌ `pages/` folder - Not needed!
❌ `Root.jsx` - Inlined in routes.tsx
❌ Scattered files - Everything is organized

### What We Achieved:
✅ **Ultra-clean top-level structure**
✅ **All features in modules/**
✅ **routes.tsx at root level for easy access**
✅ **No unnecessary folders**
✅ **Professional, enterprise-grade architecture**

### Result:
A **minimal, clean, scalable architecture** that matches enterprise-level applications with maximum clarity and zero bloat! 🚀

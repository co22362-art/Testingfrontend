# Data-Driven Components Guide

## Overview

All page components have been refactored to be **data-driven** and accept their data as props instead of having hardcoded internal state. This allows the engineering team to wrap these components with real backend data without modifying the Figma-generated files.

## Architecture Benefits

✅ **Separation of Concerns**: UI logic is separated from data fetching  
✅ **Reusability**: Components can be reused with different data sources  
✅ **Testability**: Easy to test with mock data  
✅ **Flexibility**: Backend team can manage data flow without touching UI code  
✅ **Figma Preview**: Default mock data ensures components look great in Figma  

---

## Component API Reference

### 1. LoginPage

**Location**: `/src/app/modules/auth/LoginPage.tsx`

#### Props Interface
```typescript
interface LoginPageProps {
  onSubmit?: (credentials: LoginCredentials) => void;
  isLoading?: boolean;
  error?: string | null;
  initialEmail?: string;
  initialPassword?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}
```

#### Usage Example (With Backend)
```typescript
import LoginPage from './modules/auth/LoginPage';
import { useState } from 'react';

function LoginContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      // Store token and redirect
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPage
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
```

#### Default Behavior (Without Props)
- Shows empty form
- Client-side validation only
- Console logs credentials
- Redirects to `/dashboard` on submit

---

### 2. DashboardPage

**Location**: `/src/app/modules/dashboard/DashboardPage.tsx`

#### Props Interface
```typescript
interface DashboardPageProps {
  stats?: StatCard[];
  recentActivity?: ActivityItem[];
  quickActions?: QuickAction[];
  projectOverview?: ProjectOverview;
  isLoading?: boolean;
  onQuickAction?: (path: string) => void;
}

interface StatCard {
  id: number;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

interface ActivityItem {
  id: number;
  user: string;
  action: string;
  time: string;
  initials: string;
  color: string;
}

interface ProjectOverview {
  inProgress: { count: number; progress: number };
  completed: { count: number; progress: number };
  onHold: { count: number; progress: number };
}
```

#### Usage Example (With Backend)
```typescript
import DashboardPage from './modules/dashboard/DashboardPage';
import { useEffect, useState } from 'react';
import { Users, Target, Clock, TrendingUp } from 'lucide-react';

function DashboardContainer() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        // Transform API data to match component props
        const stats = [
          { 
            id: 1, 
            title: 'Total Users', 
            value: data.totalUsers.toString(), 
            change: data.userGrowth,
            changeType: data.userGrowth.startsWith('+') ? 'positive' : 'negative',
            icon: Users,
            color: 'blue'
          },
          // ... more stats
        ];
        
        setData({
          stats,
          recentActivity: data.activity,
          projectOverview: data.projects
        });
        setIsLoading(false);
      });
  }, []);

  const handleQuickAction = (path: string) => {
    // Custom navigation logic
    window.location.href = path;
  };

  return (
    <DashboardPage
      {...data}
      isLoading={isLoading}
      onQuickAction={handleQuickAction}
    />
  );
}
```

#### Default Behavior (Without Props)
- Shows rich mock dashboard data
- All stats, activity, and overview cards populated
- Quick actions navigate using `window.location.href`

---

### 3. PeoplePage

**Location**: `/src/app/modules/people/PeoplePage.tsx`

#### Props Interface
```typescript
interface PeoplePageProps {
  users?: User[];
  isLoading?: boolean;
  onAddUser?: () => void;
  onEditUser?: (userId: number) => void;
  onImport?: () => void;
  onExport?: () => void;
  onSettingsClick?: () => void;
}

interface User {
  id: number;
  empCode: string;
  name: string;
  email: string;
  role: string;
  department: string;
  classification: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```

#### Usage Example (With Backend)
```typescript
import PeoplePage from './modules/people/PeoplePage';
import { useEffect, useState } from 'react';

function PeopleContainer() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);

  const handleAddUser = () => {
    // Open modal or navigate to add user form
    console.log('Add user clicked');
  };

  const handleEditUser = (userId: number) => {
    // Open edit modal with user data
    console.log('Edit user:', userId);
  };

  const handleImport = () => {
    // Open file picker for CSV import
    document.querySelector('#import-file-input')?.click();
  };

  const handleExport = () => {
    // Export users as CSV
    fetch('/api/users/export')
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
      });
  };

  return (
    <PeoplePage
      users={users}
      isLoading={isLoading}
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onImport={handleImport}
      onExport={handleExport}
      onSettingsClick={() => console.log('Settings clicked')}
    />
  );
}
```

#### Default Behavior (Without Props)
- Shows 10 mock users
- Search and filter functionality works client-side
- Action buttons don't trigger any API calls
- "Edit User" button only enabled when users are selected

---

### 4. DailyWinsPage

**Location**: `/src/app/modules/daily-wins/DailyWinsPage.tsx`

#### Props Interface
```typescript
interface DailyWinsPageProps {
  profile?: UserProfile;
  weekProgress?: WeekProgress;
  stats?: DailyStats;
  initialDate?: Date;
  todayDate?: Date;
  savedNote?: FormData;
  isSaving?: boolean;
  onSubmit?: (data: FormData) => void;
}

interface UserProfile {
  initials: string;
  name: string;
  team: string;
  badge: string;
}

interface WeekProgress {
  completed: boolean[];
}

interface DailyStats {
  currentStreak: number;
  totalEntries: number;
  weeklyScore: string;
}

interface FormData {
  accomplishments: string;
  learning: string;
  tomorrowPlan: string;
}
```

#### Usage Example (With Backend)
```typescript
import DailyWinsPage from './modules/daily-wins/DailyWinsPage';
import { useEffect, useState } from 'react';

function DailyWinsContainer() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [weekProgress, setWeekProgress] = useState(null);
  const [savedNote, setSavedNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user profile and stats
    Promise.all([
      fetch('/api/user/profile'),
      fetch('/api/daily-wins/stats'),
      fetch('/api/daily-wins/week-progress'),
      fetch('/api/daily-wins/today')
    ])
      .then(([profile, stats, progress, note]) => 
        Promise.all([profile.json(), stats.json(), progress.json(), note.json()])
      )
      .then(([profileData, statsData, progressData, noteData]) => {
        setProfile(profileData);
        setStats(statsData);
        setWeekProgress(progressData);
        setSavedNote(noteData);
      });
  }, []);

  const handleSubmit = async (data: FormData) => {
    setIsSaving(true);
    
    try {
      await fetch('/api/daily-wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          ...data
        })
      });
      
      alert('Daily wins saved successfully!');
    } catch (err) {
      alert('Failed to save daily wins');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DailyWinsPage
      profile={profile}
      stats={stats}
      weekProgress={weekProgress}
      savedNote={savedNote}
      isSaving={isSaving}
      onSubmit={handleSubmit}
    />
  );
}
```

#### Default Behavior (Without Props)
- Shows profile for "Shaurya Katna"
- Stats show: 7-day streak, 42 entries, 95% score
- Week shows 5/7 days completed
- Empty form for today's notes
- Console logs submission data

---

## Loading States

All components support an `isLoading` prop that shows a loading spinner:

```typescript
<PeoplePage isLoading={true} />
<DashboardPage isLoading={true} />
```

When `isLoading` is `true`, the page shows:
- Centered loading spinner
- "Loading..." message
- Consistent styling with the design system

---

## Integration Patterns

### Pattern 1: Container/Presenter Pattern (Recommended)

**Benefits**: Clean separation, easy to test, follows React best practices

```
/modules/people/
├── PeoplePage.tsx           # Presenter (Figma component)
├── PeopleContainer.tsx      # Container (data logic)
└── components/
```

**PeopleContainer.tsx**:
```typescript
import PeoplePage from './PeoplePage';
import { useUsers } from '../../hooks/useUsers';

export default function PeopleContainer() {
  const { users, isLoading, addUser, editUser, importUsers, exportUsers } = useUsers();
  
  return (
    <PeoplePage
      users={users}
      isLoading={isLoading}
      onAddUser={addUser}
      onEditUser={editUser}
      onImport={importUsers}
      onExport={exportUsers}
    />
  );
}
```

**Update routes.tsx**:
```typescript
import PeopleContainer from './modules/people/PeopleContainer';

{ path: 'people', Component: PeopleContainer }
```

---

### Pattern 2: Higher-Order Component (HOC)

**Benefits**: Reusable data fetching logic

```typescript
// withData.tsx
export function withData<P>(
  Component: React.ComponentType<P>,
  fetchData: () => Promise<Partial<P>>
) {
  return function WithDataComponent(props: P) {
    const [data, setData] = useState<Partial<P>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetchData().then(data => {
        setData(data);
        setIsLoading(false);
      });
    }, []);

    return <Component {...props} {...data} isLoading={isLoading} />;
  };
}

// Usage
const DashboardWithData = withData(DashboardPage, fetchDashboardData);
```

---

### Pattern 3: React Query / SWR Integration

**Benefits**: Caching, revalidation, automatic refetching

```typescript
import { useQuery } from '@tanstack/react-query';
import PeoplePage from './modules/people/PeoplePage';

function PeopleContainer() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  return (
    <PeoplePage
      users={data}
      isLoading={isLoading}
    />
  );
}
```

---

## Testing

### Unit Testing Page Components

```typescript
import { render, screen } from '@testing-library/react';
import PeoplePage from './PeoplePage';

describe('PeoplePage', () => {
  it('renders users from props', () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', ... }
    ];
    
    render(<PeoplePage users={mockUsers} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<PeoplePage isLoading={true} />);
    
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('calls onAddUser when add button is clicked', () => {
    const handleAdd = jest.fn();
    render(<PeoplePage onAddUser={handleAdd} />);
    
    const addButton = screen.getByText('Add User');
    addButton.click();
    
    expect(handleAdd).toHaveBeenCalled();
  });
});
```

---

## Migration Checklist

For the engineering team integrating with backend APIs:

### Step 1: Create Container Components
- [ ] Create `{Module}Container.tsx` for each page
- [ ] Move to Container/Presenter pattern
- [ ] Keep original Figma components unchanged

### Step 2: Implement Data Fetching
- [ ] Set up API client (fetch, axios, etc.)
- [ ] Create custom hooks for data fetching
- [ ] Handle loading and error states

### Step 3: Update Routes
- [ ] Update `routes.tsx` to use Container components
- [ ] Verify navigation still works

### Step 4: Add State Management (Optional)
- [ ] Integrate Redux/Zustand if needed
- [ ] Set up React Query for caching

### Step 5: Testing
- [ ] Write unit tests for containers
- [ ] Integration tests for full flow
- [ ] E2E tests for critical paths

---

## Best Practices

### ✅ DO:
- Keep Figma-generated components pure (no API calls)
- Use Container components for data fetching
- Pass all dynamic data through props
- Provide default mock data for Figma preview
- Export TypeScript interfaces for type safety

### ❌ DON'T:
- Modify Figma-generated components directly
- Add API calls inside page components
- Remove default prop values
- Change component interfaces without updating docs

---

## Support & Questions

If you need help integrating these components:

1. **Check the interfaces**: All TypeScript interfaces are exported
2. **Review examples**: See usage examples above
3. **Test with defaults**: Components work standalone with mock data
4. **Check console**: Components log important actions when handlers aren't provided

---

## Component Export Summary

All page components export their interfaces for easy integration:

```typescript
// From LoginPage
export { LoginPage, LoginCredentials }

// From DashboardPage
export { DashboardPage, StatCard, ActivityItem, QuickAction, ProjectOverview }

// From PeoplePage
export { PeoplePage, User }

// From DailyWinsPage
export { DailyWinsPage, UserProfile, WeekProgress, DailyStats }
```

---

**Last Updated**: February 26, 2026  
**Architecture Version**: 2.0 - Data-Driven Components

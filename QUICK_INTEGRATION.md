# Quick Integration Reference

## For Backend Engineers: How to Connect Your APIs

### 🚀 Quick Start (5 minutes)

#### Option 1: Wrap a Single Component

```typescript
// src/app/modules/people/PeopleContainer.tsx
import PeoplePage from './PeoplePage';
import { useState, useEffect } from 'react';

export default function PeopleContainer() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('YOUR_API_URL/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);

  return <PeoplePage users={users} isLoading={isLoading} />;
}
```

Then update `/src/app/routes.tsx`:
```typescript
import PeopleContainer from './modules/people/PeopleContainer';

{ path: 'people', Component: PeopleContainer }  // Changed!
```

Done! Your API is now connected to the People page.

---

## Component Props At-A-Glance

### LoginPage
```typescript
<LoginPage
  onSubmit={(creds) => loginAPI(creds)}
  isLoading={loading}
  error={errorMessage}
/>
```

### DashboardPage
```typescript
<DashboardPage
  stats={dashboardStats}
  recentActivity={activities}
  isLoading={loading}
/>
```

### PeoplePage
```typescript
<PeoplePage
  users={userList}
  isLoading={loading}
  onAddUser={() => openModal()}
  onEditUser={(id) => editUser(id)}
  onExport={() => downloadCSV()}
/>
```

### DailyWinsPage
```typescript
<DailyWinsPage
  profile={userProfile}
  stats={streakStats}
  onSubmit={(data) => saveWins(data)}
  isSaving={saving}
/>
```

---

## Common Integration Scenarios

### Scenario 1: Simple REST API

```typescript
// hooks/useUsers.ts
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

// PeopleContainer.tsx
import PeoplePage from './PeoplePage';
import { useUsers } from '../../hooks/useUsers';

export default function PeopleContainer() {
  const { users, loading } = useUsers();
  return <PeoplePage users={users} isLoading={loading} />;
}
```

### Scenario 2: With Authentication

```typescript
import { useAuth } from './hooks/useAuth';

export default function LoginContainer() {
  const { login, loading, error } = useAuth();
  
  return (
    <LoginPage
      onSubmit={login}
      isLoading={loading}
      error={error}
    />
  );
}

// hooks/useAuth.ts
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) throw new Error('Login failed');
      
      const { token } = await res.json();
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
```

### Scenario 3: Form Submission

```typescript
export default function DailyWinsContainer() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    
    try {
      await fetch('/api/daily-wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          ...formData
        })
      });
      
      alert('Saved!');
    } catch {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DailyWinsPage
      onSubmit={handleSubmit}
      isSaving={saving}
    />
  );
}
```

---

## API Response Transformation

Your API might return different formats. Here's how to transform them:

### Example: Transform User Data

**API Response:**
```json
{
  "data": [
    {
      "user_id": 1,
      "employee_code": "E001",
      "full_name": "John Doe",
      "email_address": "john@company.com",
      "job_title": "Developer",
      "dept": "Engineering",
      "class": "ENG",
      "active": true
    }
  ]
}
```

**Transform to Component Format:**
```typescript
const transformUsers = (apiData) => {
  return apiData.data.map(user => ({
    id: user.user_id,
    empCode: user.employee_code,
    name: user.full_name,
    email: user.email_address,
    role: user.job_title,
    department: user.dept,
    classification: user.class,
    status: user.active ? 'ACTIVE' : 'INACTIVE'
  }));
};

// Usage
fetch('/api/users')
  .then(r => r.json())
  .then(transformUsers)
  .then(setUsers);
```

---

## Error Handling

### Show Error States

```typescript
function PeopleContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return <PeoplePage users={users} isLoading={loading} />;
}
```

---

## Environment Configuration

### Setup API Base URL

```typescript
// config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  get: (path: string) => fetch(`${API_BASE_URL}${path}`),
  post: (path: string, data: any) => 
    fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
};

// Usage
import { api } from '../../config/api';

api.get('/users').then(r => r.json()).then(setUsers);
```

### .env File

```bash
VITE_API_URL=https://api.yourcompany.com
```

---

## TypeScript Tips

### Use Exported Interfaces

All components export their prop interfaces:

```typescript
import PeoplePage, { User } from './modules/people/PeoplePage';

// Now you have type safety!
const users: User[] = await fetchUsers();
```

### Create API Types

```typescript
// types/api.ts
import type { User } from '../modules/people/PeoplePage';

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
}

// Use in your code
const response: UsersResponse = await fetch('/api/users').then(r => r.json());
```

---

## Testing Your Integration

### Test with Mock Data First

Before connecting to real APIs, test with mock data:

```typescript
const MOCK_USERS = [
  { id: 1, name: 'Test User', email: 'test@test.com', ... }
];

// Start with this:
<PeoplePage users={MOCK_USERS} />

// Then connect to API:
<PeoplePage users={apiUsers} />
```

### Verify Loading States

```typescript
// Test that loading state works
<PeoplePage isLoading={true} />  // Should show spinner

// Test with data
<PeoplePage users={mockUsers} isLoading={false} />  // Should show table
```

---

## Debugging Checklist

If something doesn't work:

1. **Check the console** - Components log actions when handlers aren't provided
2. **Verify API response format** - Transform if needed
3. **Check prop names** - Must match interface exactly
4. **Test loading states** - Set `isLoading={true}` first
5. **Verify default behavior** - Components work without props

---

## Need Help?

### Quick Reference Files:
- 📘 **Full Documentation**: `/DATA_DRIVEN_COMPONENTS.md`
- 🏗️ **Architecture**: `/FILE_STRUCTURE.md`
- 🎨 **UI Components**: `/src/app/components/`

### Component Files:
- `/src/app/modules/auth/LoginPage.tsx`
- `/src/app/modules/dashboard/DashboardPage.tsx`
- `/src/app/modules/people/PeoplePage.tsx`
- `/src/app/modules/daily-wins/DailyWinsPage.tsx`

All components have:
- ✅ TypeScript interfaces
- ✅ Default mock data
- ✅ JSDoc comments
- ✅ Console logging for debugging

---

**Remember**: The Figma-generated components are **presentation components**. They display data but don't fetch it. Your job is to create **container components** that fetch data and pass it as props.

**Pattern**: Container (Your Code) → Page Component (Figma Design) → User Sees UI

That's it! Happy coding! 🚀

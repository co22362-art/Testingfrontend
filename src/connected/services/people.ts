/**
 * PEOPLE SERVICE — OUR ZONE (src/connected/services/)
 * Lives in connected/ so Figma can never delete it.
 * Proxied through Vite → http://localhost:3012
 */
import type { User } from '../../app/modules/people/PeoplePage';

// Transform API response shape → Figma's User interface
function toUser(e: Record<string, unknown>, i: number): User {
    return {
        id: i + 1,
        empCode: (e.employee_code as string) || '—',
        name: (e.name as string) || '—',
        email: (e.email as string) || '—',
        role: (e.role_title as string) || '—',
        department: (e.department as string) || '—',
        classification: (e.classification as string) || '—',
        status: ((e.status as string) === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'),
    };
}

export async function getEmployees(): Promise<User[]> {
    try {
        const res = await fetch('/api/employees', { credentials: 'include' });
        if (!res.ok) return [];
        const json = await res.json();
        const raw: unknown[] = Array.isArray(json) ? json : (json.employees ?? json.data ?? []);
        return raw.map((e, i) => toUser(e as Record<string, unknown>, i));
    } catch {
        return [];
    }
}

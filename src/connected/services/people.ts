/**
 * PEOPLE SERVICE — OUR ZONE (src/connected/services/)
 * Lives in connected/ so Figma can never delete it.
 * Proxied through Vite → http://localhost:3012
 */
import type { User } from '../../app/data/mockPeopleData';

// Transform API response shape → Figma's User interface
// Backend returns: { id, employee_code, name, email, role_title, status, 
//   department: { department_name }, classification: { classification_name } }
function toUser(e: Record<string, unknown>, index: number): User {
    const dept = e.department as Record<string, unknown> | null;
    const cls = e.classification as Record<string, unknown> | null;
    return {
        id: index + 1,
        empCode: (e.employee_code as string) || '—',
        name: (e.name as string) || '—',
        email: (e.email as string) || '—',
        role: (e.role_title as string) || '—',
        department: (dept?.department_name as string) || (e.department as string) || '—',
        classification: (cls?.classification_name as string) || (e.classification as string) || '—',
        status: ((e.status as string) === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'),
    };
}

export async function getEmployees(): Promise<User[]> {
    try {
        const res = await fetch('/api/employees', { credentials: 'include' });
        if (!res.ok) return [];
        const json = await res.json();
        // Backend returns paginated: { data: [...], count: N } or direct array
        const raw: unknown[] = Array.isArray(json) ? json : (json.data ?? json.employees ?? []);
        return raw.map((e, i) => toUser(e as Record<string, unknown>, i));
    } catch {
        return [];
    }
}

/**
 * DAILY WINS SERVICE — OUR ZONE (src/connected/services/)
 * Lives in connected/ so Figma can never delete it.
 * Proxied through Vite → http://localhost:3010
 */
import type { UserProfile, DailyStats, Employee } from '../../app/data/mockDailyWinsData';

export interface DailyNote {
    wins?: string;
    learnings?: string;
}

/**
 * Fetch self profile + supervisees list from /api/daily-wins/people.
 * Returns { self, employees } where employees includes self + supervisees.
 */
export async function getDailyWinsPeople(): Promise<{ self: Employee | null; employees: Employee[] }> {
    try {
        const res = await fetch('/api/daily-wins/people', { credentials: 'include' });
        if (!res.ok) return { self: null, employees: [] };
        const json = await res.json();
        if (!json.success) return { self: null, employees: [] };

        const selfData = json.self;
        const supervisees: unknown[] = json.supervisees || [];

        // Map self to Employee shape
        const selfEmployee: Employee | null = selfData ? {
            id: String(selfData.id),
            name: selfData.name || selfData.email || 'You',
            designation: selfData.role_title || selfData.department || 'Team Member',
            isSelf: true,
        } : null;

        // Map supervisees to Employee shape
        const superviseeEmployees: Employee[] = supervisees.map((s: unknown) => {
            const sup = s as Record<string, unknown>;
            return {
                id: String(sup.id),
                name: (sup.name as string) || (sup.email as string) || 'Unknown',
                designation: (sup.role_title as string) || (sup.department as string) || 'Team Member',
                isSelf: false,
            };
        });

        const employees = selfEmployee ? [selfEmployee, ...superviseeEmployees] : superviseeEmployees;
        return { self: selfEmployee, employees };
    } catch {
        return { self: null, employees: [] };
    }
}

/**
 * Build a UserProfile from the self employee data.
 */
export function toUserProfile(self: Employee): UserProfile {
    const names = self.name.split(' ');
    return {
        initials: names.map(n => n[0]).join('').toUpperCase().slice(0, 2),
        name: self.name,
        team: self.designation || 'Team Member',
        badge: '',
    };
}

export async function getDailyStats(): Promise<DailyStats> {
    // TODO: Wire to a real stats endpoint when available
    return { currentStreak: 0, totalEntries: 0, weeklyScore: '—' };
}

export async function getDailyNote(date: string, employeeId?: string): Promise<DailyNote | null> {
    try {
        let url = `/api/daily-wins/notes?date=${date}`;
        if (employeeId) url += `&employeeId=${employeeId}`;
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.success) return null;
        return json.data ?? json.note ?? json;
    } catch {
        return null;
    }
}

export async function saveDailyNote(employeeId: string, date: string, wins: string, learnings: string): Promise<boolean> {
    try {
        const res = await fetch('/api/daily-wins/notes', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employee_id: employeeId, date, wins, learnings }),
        });
        return res.ok;
    } catch {
        return false;
    }
}

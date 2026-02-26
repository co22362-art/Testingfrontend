/**
 * DAILY WINS SERVICE
 * Connects to pa_3010_daily_wins (port 3010) via Vite proxy.
 */

export interface DailyWinsPerson {
    id: string;
    name: string;
    email: string;
    role_title: string;
    department: string;
    company_id: string;
}

export interface DailyWinsNote {
    id?: string;
    employee_id: string;
    date: string;           // YYYY-MM-DD
    wins: string;
    learnings: string;
    blockers?: string;
}

/**
 * Fetch the current user's profile + their supervisees for sidebar.
 */
export async function getDailyWinsPeople(): Promise<{
    self: DailyWinsPerson | null;
    supervisees: DailyWinsPerson[];
}> {
    try {
        const res = await fetch('/api/daily-wins/people', {
            credentials: 'include',
        });
        if (!res.ok) return { self: null, supervisees: [] };
        const data = await res.json();
        return {
            self: data.self ?? null,
            supervisees: data.supervisees ?? [],
        };
    } catch {
        return { self: null, supervisees: [] };
    }
}

/**
 * Fetch the daily note for a given date and employee.
 * @param date   - YYYY-MM-DD
 * @param employeeId - optional, defaults to self
 */
export async function getDailyNote(
    date: string,
    employeeId?: string
): Promise<DailyWinsNote | null> {
    try {
        const params = new URLSearchParams({ date });
        if (employeeId) params.append('employeeId', employeeId);

        const res = await fetch(`/api/daily-wins/notes?${params}`, {
            credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data ?? null;
    } catch {
        return null;
    }
}

/**
 * Save (create or update) a daily note.
 */
export async function saveDailyNote(note: DailyWinsNote): Promise<boolean> {
    try {
        const res = await fetch('/api/daily-wins/notes', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        return res.ok;
    } catch {
        return false;
    }
}

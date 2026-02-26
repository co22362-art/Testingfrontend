/**
 * DAILY WINS SERVICE — OUR ZONE (src/connected/services/)
 * Lives in connected/ so Figma can never delete it.
 * Proxied through Vite → http://localhost:3010
 */
import type { UserProfile, DailyStats } from '../../app/modules/daily-wins/DailyWinsPage';

export interface DailyNote {
    wins?: string;
    learnings?: string;
}

export async function getSelfProfile(): Promise<UserProfile | null> {
    try {
        const res = await fetch('/api/daily-wins/people', { credentials: 'include' });
        if (!res.ok) return null;
        const json = await res.json();
        const self = json.self ?? json;
        if (!self?.name) return null;
        const names = (self.name as string).split(' ');
        return {
            initials: names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
            name: self.name,
            team: self.role_title || self.department || 'Team Member',
            badge: self.email || '',
        };
    } catch {
        return null;
    }
}

export async function getDailyStats(): Promise<DailyStats> {
    // Extend later — returning placeholder for now
    return { currentStreak: 0, totalEntries: 0, weeklyScore: '—' };
}

export async function getDailyNote(date: string): Promise<DailyNote | null> {
    try {
        const res = await fetch(`/api/daily-wins/notes?date=${date}`, { credentials: 'include' });
        if (!res.ok) return null;
        const json = await res.json();
        return json.note ?? json;
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

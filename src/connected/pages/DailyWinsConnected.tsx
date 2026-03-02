/**
 * DAILY WINS CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `DailyWinsPage` and supply it with REAL data
 * from the /api/daily-wins/* endpoints.
 * Shows a loading spinner until real data is fetched.
 */
import { useState, useEffect } from 'react';
import DailyWinsPage from '../../app/modules/3010_daily_wins/DailyWinsPage';
import PAAppLayout from '../../app/components/PAAppLayout';
import { getDailyWinsPeople, toUserProfile, getDailyStats, getDailyNote, saveDailyNote } from '../services/dailyWins';
import type { UserProfile, DailyStats, Employee } from '../../app/data/mockDailyWinsData';

export default function DailyWinsConnected() {
    const [profile, setProfile] = useState<UserProfile | undefined>();
    const [stats, setStats] = useState<DailyStats | undefined>();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selfId, setSelfId] = useState<string>('');
    const [savedNote, setSavedNote] = useState({ accomplishments: '', learning: '', tomorrowPlan: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch employees + profile on mount
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const [{ self, employees: empList }, statsData] = await Promise.all([
                getDailyWinsPeople(),
                getDailyStats(),
            ]);

            if (self) {
                setProfile(toUserProfile(self));
                setSelfId(self.id);
            }
            setEmployees(empList);
            setStats(statsData);

            // Load today's note
            const today = new Date();
            const apiDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const note = await getDailyNote(apiDate, self?.id);
            if (note) {
                setSavedNote({
                    accomplishments: note.wins || '',
                    learning: note.learnings || '',
                    tomorrowPlan: '',
                });
            }
            setIsLoading(false);
        })();
    }, []);

    const handleSubmit = async (data: { accomplishments: string; learning: string; tomorrowPlan: string }) => {
        if (!selfId) return;
        setIsSaving(true);
        const today = new Date();
        const apiDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        await saveDailyNote(selfId, apiDate, data.accomplishments, data.learning);
        setIsSaving(false);
    };

    // Show loading spinner until real data arrives — never show mock data
    if (isLoading) {
        return (
            <PAAppLayout>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Loading daily wins...</p>
                    </div>
                </div>
            </PAAppLayout>
        );
    }

    return (
        <DailyWinsPage
            profile={profile}
            stats={stats}
            employees={employees.length > 0 ? employees : undefined}
            savedNote={savedNote}
            isSaving={isSaving}
            onSubmit={handleSubmit}
        />
    );
}

/**
 * DAILY WINS CONNECTED
 * ─────────────────────────────────────────────────────────
 * Wrap Figma's `DailyWinsPage` component and supply it with data.
 */
import { useState, useEffect } from 'react';
import DailyWinsPage from '../../app/modules/daily-wins/DailyWinsPage';
import { getSelfProfile, getDailyStats, getDailyNote, saveDailyNote } from '../services/dailyWins';
import type { UserProfile, DailyStats } from '../../app/modules/daily-wins/DailyWinsPage';

export default function DailyWinsConnected() {
    const [profile, setProfile] = useState<UserProfile | undefined>();
    const [stats, setStats] = useState<DailyStats | undefined>();
    const [savedNote, setSavedNote] = useState({ accomplishments: '', learning: '', tomorrowPlan: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [employeeId, setEmployeeId] = useState<string>('');

    // Initial load
    useEffect(() => {
        Promise.all([
            getSelfProfile(),
            getDailyStats(),
        ]).then(([profileData, statsData]) => {
            if (profileData) setProfile(profileData);
            setStats(statsData);
            // Hack: In a real app we'd get the ID from auth context or the profile response directly
            // Assuming we stored it in session on login, or we could fetch it
            const savedUserStr = sessionStorage.getItem('pa_user');
            if (savedUserStr) {
                try {
                    const user = JSON.parse(savedUserStr);
                    if (user.id) setEmployeeId(user.id);
                } catch { }
            }
        });
    }, []);

    // When date changes, load that date's note
    useEffect(() => {
        const apiDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        getDailyNote(apiDate).then(note => {
            setSavedNote({
                accomplishments: note?.wins || '',
                learning: note?.learnings || '',
                tomorrowPlan: '',
            });
        });
    }, [selectedDate]);

    const handleSubmit = async (data: { accomplishments: string; learning: string; tomorrowPlan: string }) => {
        if (!employeeId) return; // need an ID to save
        setIsSaving(true);
        const apiDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

        await saveDailyNote(employeeId, apiDate, data.accomplishments, data.learning);
        // Assuming success for the wrapper UI flow
        setIsSaving(false);
    };

    // Figma's component expects to handle date state internally, 
    // but we might need to intercept it. If the component doesn't emit date changes
    // via a prop, we'll just pass down the data for 'today' for now.
    // We'll pass the loaded note.

    return (
        <DailyWinsPage
            profile={profile}
            stats={stats}
            savedNote={savedNote}
            isSaving={isSaving}
            onSubmit={handleSubmit}
        />
    );
}

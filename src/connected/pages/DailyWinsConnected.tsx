/**
 * DAILY WINS CONNECTED PAGE
 * ─────────────────────────────────────────────────────────
 * OUR ZONE: Real profile + notes from pa_3010_daily_wins.
 *
 * Atoms from Figma used here:
 *   PAAppLayout → src/app/components/PAAppLayout.tsx
 *   PACard      → src/app/components/ui/PACard.tsx
 *
 * Visual reference: src/app/modules/daily-wins/DailyWinsPage.tsx
 *   (DO NOT EDIT THAT FILE — Figma owns it)
 * ─────────────────────────────────────────────────────────
 */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Flame, Star, Loader2 } from 'lucide-react';
import PAAppLayout from '../../app/components/PAAppLayout';
import PACard from '../../app/components/ui/PACard';
import { getDailyWinsPeople, getDailyNote, saveDailyNote, DailyWinsPerson } from '../../services/dailyWins';

const TODAY = new Date();

function toApiDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DailyWinsConnected() {
    const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
    const [showCalendar, setShowCalendar] = useState(false);
    const [form, setForm] = useState({ accomplishments: '', learning: '', tomorrowPlan: '' });

    // ── Real data ──────────────────────────────────────────
    const [self, setSelf] = useState<DailyWinsPerson | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        getDailyWinsPeople().then(({ self }) => { setSelf(self); setIsProfileLoading(false); });
    }, []);

    useEffect(() => {
        getDailyNote(toApiDate(selectedDate)).then(note => {
            setForm(note ? { accomplishments: note.wins || '', learning: note.learnings || '', tomorrowPlan: '' }
                : { accomplishments: '', learning: '', tomorrowPlan: '' });
        });
    }, [selectedDate]);
    // ──────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!self) return;
        setIsSaving(true);
        const ok = await saveDailyNote({ employee_id: self.id, date: toApiDate(selectedDate), wins: form.accomplishments, learnings: form.learning });
        setIsSaving(false);
        setSaveStatus(ok ? 'success' : 'error');
        setTimeout(() => setSaveStatus('idle'), 3000);
    };

    const getDaysInMonth = (d: Date) => {
        const first = new Date(d.getFullYear(), d.getMonth(), 1);
        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const start = first.getDay() === 0 ? 6 : first.getDay() - 1;
        return [...Array(start).fill(null), ...Array.from({ length: last.getDate() }, (_, i) => i + 1)];
    };

    const dateDisplay = `${DAY_NAMES[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    const isToday = selectedDate.toDateString() === TODAY.toDateString();
    const calendarDays = getDaysInMonth(selectedDate);

    const navigate = (dir: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + dir);
        setSelectedDate(d);
    };

    return (
        <PAAppLayout activePage="daily-wins">
            <div className="flex-1 overflow-auto bg-[#F9FAFB]">
                <div className="p-6 max-w-7xl mx-auto space-y-6">

                    <div className="mb-2">
                        <h1 className="text-2xl font-semibold text-[#111827] mb-1">Daily Wins</h1>
                        <p className="text-sm text-[#6B7280]">Track your daily progress and achievements</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { icon: Flame, label: 'Current Streak', value: '7 days', color: 'from-orange-500 to-orange-600' },
                            { icon: CalendarIcon, label: 'Total Entries', value: '42', color: 'from-[#1976D2] to-[#1565C0]' },
                            { icon: Star, label: 'Weekly Score', value: '95%', color: 'from-yellow-500 to-yellow-600' },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <PACard key={label} className="p-5 hover:shadow-md transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#6B7280] mb-0.5">{label}</p>
                                        <p className="text-3xl font-bold text-[#111827]">{value}</p>
                                    </div>
                                </div>
                            </PACard>
                        ))}
                    </div>

                    {/* Profile + Weekly */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PACard className="p-6 bg-gradient-to-br from-blue-50 to-white">
                            <h3 className="text-base font-semibold text-[#111827] mb-4">Your Profile</h3>
                            {isProfileLoading ? (
                                <div className="flex items-center gap-3"><Loader2 className="w-6 h-6 animate-spin text-[#1976D2]" /><span className="text-sm text-[#6B7280]">Loading...</span></div>
                            ) : self ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#1976D2] to-[#1565C0] flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white font-bold text-xl">{getInitials(self.name)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#111827] text-lg mb-1">{self.name}</h3>
                                        <p className="text-sm text-[#6B7280] mb-2">{self.role_title || self.department || 'Team Member'}</p>
                                        <span className="text-xs font-mono text-[#6B7280] bg-white px-3 py-1.5 rounded-lg border border-[#E5E7EB]">{self.email}</span>
                                    </div>
                                </div>
                            ) : <p className="text-sm text-[#6B7280]">Profile unavailable. Please sign in.</p>}
                        </PACard>

                        <PACard className="p-6">
                            <h3 className="text-base font-semibold text-[#111827] mb-4">This Week's Progress</h3>
                            <div className="grid grid-cols-7 gap-3">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xs font-semibold text-[#6B7280] mb-2">{d}</div>
                                        <div className={`w-full h-10 rounded-lg flex items-center justify-center transition-all ${i < 4 ? 'bg-green-500' : i === 4 ? 'bg-[#1976D2] scale-110' : 'bg-gray-100'}`}>
                                            {i < 5 && <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PACard>
                    </div>

                    {/* Date Nav */}
                    <div className="flex items-center justify-between">
                        <button onClick={() => navigate(-1)} className="h-11 px-6 bg-white border border-[#E5E7EB] rounded-lg text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] hover:shadow-md transition-all flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Previous Day
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowCalendar(!showCalendar)} className="px-8 py-3 bg-white border-2 border-[#1976D2] rounded-lg hover:shadow-lg transition-all">
                                <span className="text-sm font-bold text-[#1976D2]">{dateDisplay}</span>
                            </button>
                            {showCalendar && (
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-[#E5E7EB] rounded-lg shadow-2xl p-5 z-50 min-w-[360px]">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-bold text-base text-[#111827]">{MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 mb-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-center text-xs font-bold text-[#6B7280] py-2">{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {calendarDays.map((day, i) => (
                                            <button key={i} disabled={!day} onClick={() => { if (day) { const d = new Date(selectedDate); d.setDate(day); setSelectedDate(d); setShowCalendar(false); } }}
                                                className={`h-11 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${!day ? 'cursor-default' : day === selectedDate.getDate() ? 'bg-[#1976D2] text-white shadow-md scale-110' : 'hover:bg-[#F3F4F6] text-[#374151]'}`}>
                                                {day || ''}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                                        <button onClick={() => { setSelectedDate(TODAY); setShowCalendar(false); }} className="w-full h-11 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all">Go to Today</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => navigate(1)} disabled={isToday} className={`h-11 px-6 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${isToday ? 'bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed border border-[#E5E7EB]' : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] hover:shadow-md'}`}>
                            Next Day <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Form */}
                    <PACard className="p-8 shadow-md">
                        <h2 className="text-xl font-semibold text-[#111827] mb-2">Record Your Progress</h2>
                        <p className="text-sm text-[#6B7280] mb-8">Document your achievements and learnings for today</p>
                        <div className="space-y-6">
                            {[
                                { key: 'accomplishments', label: "Today's Accomplishments", placeholder: "What did you accomplish today?", hint: <><TrendingUp className="w-3 h-3" />Focus on outcomes and impact</> },
                                { key: 'learning', label: "Today's Learning", placeholder: "What did you learn today?", hint: <><Star className="w-3 h-3" />Document insights and challenges overcome</> },
                                { key: 'tomorrowPlan', label: "Tomorrow's Plan", placeholder: "What are your goals for tomorrow?", hint: <><CalendarIcon className="w-3 h-3" />Set 2-3 priority goals</> },
                            ].map(({ key, label, placeholder, hint }) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold text-[#111827] mb-2">{label}</label>
                                    <textarea value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        placeholder={placeholder} rows={5}
                                        className="w-full h-32 px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 resize-none transition-all" />
                                    <p className="text-xs text-[#6B7280] mt-2 flex items-center gap-1">{hint}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E7EB]">
                            {saveStatus === 'success' && <p className="text-sm text-green-600 font-medium">✓ Saved successfully!</p>}
                            {saveStatus === 'error' && <p className="text-sm text-red-600">Failed to save. Please try again.</p>}
                            {saveStatus === 'idle' && <span />}
                            <button onClick={handleSubmit} disabled={isSaving || !self}
                                className="h-12 px-10 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-lg font-bold hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSaving ? 'Saving...' : 'Submit Daily Wins'}
                            </button>
                        </div>
                    </PACard>

                </div>
            </div>
        </PAAppLayout>
    );
}

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Flame, Star } from 'lucide-react';
import PAAppLayout from '../../components/PAAppLayout';
import PACard from '../../components/ui/PACard';

interface FormData {
  accomplishments: string;
  learning: string;
  tomorrowPlan: string;
}

export interface UserProfile {
  initials: string;
  name: string;
  team: string;
  badge: string;
}

export interface WeekProgress {
  completed: boolean[];
}

export interface DailyStats {
  currentStreak: number;
  totalEntries: number;
  weeklyScore: string;
}

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

// Default mock data for Figma preview
const DEFAULT_PROFILE: UserProfile = {
  initials: 'SK',
  name: 'Shaurya Katna',
  team: 'Programming Team',
  badge: '#SK2026'
};

const DEFAULT_WEEK_PROGRESS: WeekProgress = {
  completed: [true, true, true, true, true, false, false]
};

const DEFAULT_STATS: DailyStats = {
  currentStreak: 7,
  totalEntries: 42,
  weeklyScore: '95%'
};

export default function DailyWinsPage({
  profile = DEFAULT_PROFILE,
  weekProgress = DEFAULT_WEEK_PROGRESS,
  stats = DEFAULT_STATS,
  initialDate = new Date(2026, 1, 26),
  todayDate = new Date(2026, 1, 26),
  savedNote,
  isSaving = false,
  onSubmit
}: DailyWinsPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(savedNote || {
    accomplishments: '',
    learning: '',
    tomorrowPlan: ''
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Submitting daily wins:', formData);
    }
  };

  const dateDisplay = formatDate(selectedDate);
  const calendarDays = getDaysInMonth(selectedDate);
  const isToday = selectedDate.toDateString() === todayDate.toDateString();

  return (
    <PAAppLayout activePage="daily-wins">
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold text-foreground mb-1">Daily Wins</h1>
              <p className="text-sm text-muted-foreground">Track your daily progress and achievements</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <PACard className="p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-0.5">Current Streak</p>
                    <p className="text-3xl font-bold text-foreground">{stats.currentStreak} days</p>
                  </div>
                </div>
              </PACard>
              
              <PACard className="p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                    <CalendarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-0.5">Total Entries</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalEntries}</p>
                  </div>
                </div>
              </PACard>

              <PACard className="p-5 hover:shadow-md transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                    <Star className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-0.5">Weekly Score</p>
                    <p className="text-3xl font-bold text-foreground">{stats.weeklyScore}</p>
                  </div>
                </div>
              </PACard>
            </div>

            {/* User Info & Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Card */}
              <PACard className="p-6 bg-gradient-to-br from-blue-50 to-card dark:from-card dark:to-card border-border">
                <h3 className="text-base font-semibold text-foreground mb-4">Your Profile</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-xl">{profile.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{profile.team}</p>
                    <span className="inline-block text-xs font-mono text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border shadow-sm">
                      {profile.badge}
                    </span>
                  </div>
                </div>
              </PACard>

              {/* Weekly Progress */}
              <PACard className="p-6">
                <h3 className="text-base font-semibold text-foreground mb-4">This Week's Progress</h3>
                <div className="grid grid-cols-7 gap-3">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">{day}</div>
                      <div className={`w-full h-10 rounded-lg flex items-center justify-center transition-all ${
                        weekProgress.completed[index] 
                          ? index === 4 
                            ? 'bg-primary shadow-md scale-110' 
                            : 'bg-green-500 shadow-sm hover:shadow-md'
                          : 'bg-muted'
                      }`}>
                        {weekProgress.completed[index] && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </PACard>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-between">
              <button 
                onClick={handlePreviousDay}
                className="h-11 px-6 bg-card border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-accent hover:shadow-md transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Day
              </button>
              
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="relative"
              >
                <div className="px-8 py-3 bg-card border-2 border-primary rounded-lg hover:shadow-lg transition-all">
                  <span className="text-sm font-bold text-primary">{dateDisplay}</span>
                </div>

                {/* Calendar Dropdown */}
                {showCalendar && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-2xl p-5 z-50 min-w-[360px]">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <span className="font-bold text-base text-foreground">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                      </span>
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => day && handleDateSelect(day)}
                          disabled={!day}
                          className={`h-11 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                            !day 
                              ? 'cursor-default' 
                              : day === selectedDate.getDate()
                                ? 'bg-primary text-white shadow-md scale-110'
                                : 'hover:bg-accent text-foreground hover:scale-105'
                          }`}
                        >
                          {day || ''}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-border">
                      <button 
                        onClick={() => {
                          setSelectedDate(todayDate);
                          setShowCalendar(false);
                        }}
                        className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                      >
                        Go to Today
                      </button>
                    </div>
                  </div>
                )}
              </button>
              
              <button 
                onClick={handleNextDay}
                disabled={isToday}
                className={`h-11 px-6 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isToday 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border' 
                    : 'bg-card border border-border text-foreground hover:bg-accent hover:shadow-md'
                }`}
              >
                Next Day
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Form Section */}
            <PACard className="p-8 shadow-md">
              <h2 className="text-xl font-semibold text-foreground mb-2">Record Your Progress</h2>
              <p className="text-sm text-muted-foreground mb-8">Document your achievements and learnings for today</p>
              
              <div className="space-y-6">
                {/* Accomplishments */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Today's Accomplishments
                  </label>
                  <textarea
                    value={formData.accomplishments}
                    onChange={(e) => setFormData({...formData, accomplishments: e.target.value})}
                    placeholder="What did you accomplish today?"
                    className="w-full h-32 px-4 py-3 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground bg-input-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/10 resize-none transition-all"
                    rows={5}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Focus on outcomes and impact
                  </p>
                </div>

                {/* Learning */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Today's Learning
                  </label>
                  <textarea
                    value={formData.learning}
                    onChange={(e) => setFormData({...formData, learning: e.target.value})}
                    placeholder="What did you learn today?"
                    className="w-full h-32 px-4 py-3 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground bg-input-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/10 resize-none transition-all"
                    rows={5}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Document insights and challenges overcome
                  </p>
                </div>

                {/* Tomorrow's Plan */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tomorrow's Plan
                  </label>
                  <textarea
                    value={formData.tomorrowPlan}
                    onChange={(e) => setFormData({...formData, tomorrowPlan: e.target.value})}
                    placeholder="What are your goals for tomorrow?"
                    className="w-full h-32 px-4 py-3 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground bg-input-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/10 resize-none transition-all"
                    rows={5}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    Set 2-3 priority goals
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-border">
                <button 
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className={`h-12 px-10 rounded-lg font-bold transition-all duration-200 transform ${
                    isSaving
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Submit Daily Wins'}
                </button>
              </div>
            </PACard>
          </div>
        </div>
      </div>
    </PAAppLayout>
  );
}
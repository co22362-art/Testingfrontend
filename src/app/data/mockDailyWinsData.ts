// Types
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

export interface Employee {
  id: string;
  name: string;
  designation: string;
  isSelf: boolean;
}

// Mock Data - Default Profile
export const mockProfile: UserProfile = {
  initials: 'SK',
  name: 'Shaurya Katna',
  team: 'Programming Team',
  badge: '#SK2026'
};

// Mock Data - Default Week Progress
export const mockWeekProgress: WeekProgress = {
  completed: [true, true, true, true, true, false, false]
};

// Mock Data - Default Stats
export const mockDailyStats: DailyStats = {
  currentStreak: 7,
  totalEntries: 42,
  weeklyScore: '95%'
};

// Mock Data - Employees List
export const mockEmployees: Employee[] = [
  { id: '1', name: 'Varun Garg', designation: 'Senior Designer', isSelf: true },
  { id: '2', name: 'Amrit Dhiman', designation: 'Junior Drafter', isSelf: false },
  { id: '3', name: 'Aman Singh', designation: 'Engineer', isSelf: false },
  { id: '4', name: 'Aditya Mehta', designation: 'Junior Designer', isSelf: false },
  { id: '5', name: 'Aaryan Sehgal', designation: 'Junior Designer', isSelf: false },
  { id: '6', name: 'Shubham Rastogi', designation: 'Intermediate Designer', isSelf: false },
  { id: '7', name: 'Manjot Singh', designation: 'Junior Designer', isSelf: false },
  { id: '8', name: 'Tarun Garg', designation: 'Senior Drafter', isSelf: false },
  { id: '9', name: 'Abhinav Heera', designation: 'Junior Designer', isSelf: false },
];

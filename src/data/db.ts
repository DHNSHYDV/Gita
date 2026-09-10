// Devotee Streaks & Persistent Storage Engine

export interface LeaderboardEntry {
  rank: number;
  name: string;
  isCurrentUser?: boolean;
  quote?: string;
  streakDays: number;
  avatarUrl?: string;
}

export interface UserStreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string; // YYYY-MM-DD
  totalVersesRead: number;
  streakHistory: string[]; // List of YYYY-MM-DD dates
}

const STORAGE_KEY_STREAK = 'gita_devotee_streak';

export const getStoredStreak = (): UserStreakInfo => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STREAK);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean up any legacy dummy 72 streak from previous mockup
      if (parsed.currentStreak === 72 && parsed.totalVersesRead === 144) {
        const cleanStreak: UserStreakInfo = {
          currentStreak: 0,
          longestStreak: 0,
          lastReadDate: '',
          totalVersesRead: 0,
          streakHistory: [],
        };
        localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(cleanStreak));
        return cleanStreak;
      }
      return parsed;
    }
  } catch {
    // fallback
  }

  // Real starting streak is 0 until user reads their first verse
  const defaultStreak: UserStreakInfo = {
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: '',
    totalVersesRead: 0,
    streakHistory: [],
  };

  localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(defaultStreak));
  return defaultStreak;
};

export const recordReadingForStreak = (): UserStreakInfo => {
  const current = getStoredStreak();
  const todayStr = new Date().toISOString().split('T')[0];

  if (current.lastReadDate === todayStr) {
    // Already read today, increment total count
    current.totalVersesRead += 1;
  } else {
    if (!current.lastReadDate) {
      // First ever reading
      current.currentStreak = 1;
      current.longestStreak = 1;
    } else {
      const lastDate = new Date(current.lastReadDate);
      const today = new Date(todayStr);
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        current.currentStreak += 1;
        if (current.currentStreak > current.longestStreak) {
          current.longestStreak = current.currentStreak;
        }
      } else if (diffDays > 1) {
        // Streak broken, start anew from 1 today
        current.currentStreak = 1;
      }
    }
    current.lastReadDate = todayStr;
    current.totalVersesRead += 1;
    if (!current.streakHistory.includes(todayStr)) {
      current.streakHistory.push(todayStr);
    }
  }

  localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(current));
  return current;
};

export const getLeaderboardData = (
  _period: 'today' | 'week' | 'all',
  currentUserName: string = 'Devotee'
): LeaderboardEntry[] => {
  const streak = getStoredStreak();

  return [
    {
      rank: 1,
      name: `${currentUserName} (You)`,
      isCurrentUser: true,
      streakDays: streak.currentStreak,
    },
  ];
};

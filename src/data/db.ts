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
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  // Default starting streak: 72 days as shown in storyboard!
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultStreak: UserStreakInfo = {
    currentStreak: 72,
    longestStreak: 72,
    lastReadDate: todayStr,
    totalVersesRead: 144,
    streakHistory: [todayStr],
  };

  localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(defaultStreak));
  return defaultStreak;
};

export const recordReadingForStreak = (): UserStreakInfo => {
  const current = getStoredStreak();
  const todayStr = new Date().toISOString().split('T')[0];

  if (current.lastReadDate === todayStr) {
    // Already read today, just increment total count
    current.totalVersesRead += 1;
  } else {
    // Check if consecutive
    const lastDate = new Date(current.lastReadDate);
    const today = new Date(todayStr);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      current.currentStreak += 1;
      if (current.currentStreak > current.longestStreak) {
        current.longestStreak = current.currentStreak;
      }
    } else if (diffDays > 1) {
      // Streak broken, start anew
      current.currentStreak = 1;
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
  period: 'today' | 'week' | 'all',
  currentUserName: string = 'Dhanush'
): LeaderboardEntry[] => {
  const streak = getStoredStreak();

  // Multipliers or adjustments per period
  const userStreak = streak.currentStreak;

  return [
    {
      rank: 1,
      name: 'Arjun_108',
      quote: 'Gita is my guide.',
      streakDays: period === 'today' ? 365 : period === 'week' ? 372 : 450,
    },
    {
      rank: 2,
      name: 'Sita_Ram',
      quote: 'Steady in sadhana.',
      streakDays: period === 'today' ? 280 : period === 'week' ? 287 : 320,
    },
    {
      rank: 3,
      name: 'Vidyadhar',
      quote: 'Karma, Always.',
      streakDays: period === 'today' ? 214 : period === 'week' ? 221 : 250,
    },
    {
      rank: 4,
      name: 'BhaktiNivas',
      streakDays: period === 'today' ? 180 : period === 'week' ? 187 : 205,
    },
    {
      rank: 5,
      name: `${currentUserName} (You)`,
      isCurrentUser: true,
      streakDays: userStreak,
    },
    {
      rank: 6,
      name: 'GitaPrem',
      streakDays: period === 'today' ? 60 : period === 'week' ? 67 : 85,
    },
  ];
};

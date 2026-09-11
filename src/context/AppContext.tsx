import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, TextSize, ThemeMode, ScreenType } from '../types';
import { UI_TRANSLATIONS, UIStrings } from '../data/translations';
import { updateNativeStatusBar } from '../utils/native';
import { supabase, fetchUserProfile, syncDevoteeProgress, deleteUserAccount } from '../utils/supabase';
import { getStoredStreak, resetStoredStreak } from '../data/db';
import { scheduleDailyMorningQuotes } from '../utils/notifications';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  goBack: () => boolean;
  selectedChapter: number;
  setSelectedChapter: (chapter: number) => void;
  selectedVerse: number;
  setSelectedVerse: (verse: number) => void;
  bookmarks: string[];
  toggleBookmark: (verseId: string) => void;
  isBookmarked: (verseId: string) => boolean;
  dailyVerseModalOpen: boolean;
  setDailyVerseModalOpen: (open: boolean) => void;
  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => void;
  lastRead: { chapter: number; verse: number };
  setLastRead: (pos: { chapter: number; verse: number }) => void;
  readingHistory: { chapter: number; verse: number; date: string }[];
  navigateToShloka: (chapter: number, verse: number) => void;
  t: UIStrings;
  openSettingsFromScreen: ScreenType | null;
  setOpenSettingsFromScreen: (screen: ScreenType | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  isGoogleLinked: boolean;
  setIsGoogleLinked: (linked: boolean) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  screenDirection: number;
  listenedVerses: string[];
  awardListenPoint: (chapter: number, verse: number) => boolean;
  sadhanaPoints: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  deleteAccountAndResetData: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gita_language') as Language) || 'te';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('gita_textSize') as TextSize) || 'md';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('gita_theme') as ThemeMode) || 'light';
  });

  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(() => {
    return localStorage.getItem('gita_onboarding_completed') === 'true';
  });

  // Start on welcome
  const [currentScreen, setCurrentScreenState] = useState<ScreenType>('welcome');
  const [navStack, setNavStack] = useState<ScreenType[]>(['welcome']);
  const [openSettingsFromScreen, setOpenSettingsFromScreen] = useState<ScreenType | null>(null);
  const [screenDirection, setScreenDirection] = useState<number>(1);

  const TAB_ORDER: Record<string, number> = {
    'home': 0,
    'chapters': 1,
    'streaks': 2,
    'bookmarks': 3,
    'more': 4,
  };

  const setCurrentScreen = (screen: ScreenType) => {
    if (screen in TAB_ORDER && currentScreen in TAB_ORDER) {
      setScreenDirection(TAB_ORDER[screen] >= TAB_ORDER[currentScreen] ? 1 : -1);
    } else {
      setScreenDirection(1);
    }
    setCurrentScreenState(screen);
    setNavStack(prev => {
      if (prev[prev.length - 1] === screen) return prev;
      if (screen === 'home') return ['home'];
      return [...prev.slice(-12), screen];
    });
  };

  const goBack = (): boolean => {
    // 1. Close daily verse modal first if open
    if (dailyVerseModalOpen) {
      setDailyVerseModalOpen(false);
      return true;
    }

    // 2. If in settings, return to screen that opened it
    if (currentScreen === 'settings') {
      if (openSettingsFromScreen) {
        const target = openSettingsFromScreen;
        setOpenSettingsFromScreen(null);
        setCurrentScreen(target);
        return true;
      }
      setCurrentScreen('more');
      return true;
    }

    // 3. Pop navigation stack if history exists
    if (navStack.length > 1) {
      setScreenDirection(-1);
      const nextStack = [...navStack];
      nextStack.pop();
      const previousScreen = nextStack[nextStack.length - 1];
      setNavStack(nextStack);
      setCurrentScreenState(previousScreen);
      return true;
    }

    // 4. Return to home if on secondary screen
    if (currentScreen !== 'home' && currentScreen !== 'welcome') {
      setScreenDirection(-1);
      setCurrentScreenState('home');
      setNavStack(['home']);
      return true;
    }

    // Base screen (home or welcome)
    return false;
  };

  // User Profile Name (defaults to '' or saved name)
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('gita_userName') || '';
  });

  const [isGoogleLinked, setIsGoogleLinkedState] = useState<boolean>(() => {
    return localStorage.getItem('gita_google_linked') === 'true';
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(2);
  const [selectedVerse, setSelectedVerse] = useState<number>(47);

  // Real-time Bookmarks (starts empty, cleans up legacy dummy bookmarks)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('gita_bookmarks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear old dummy mockup bookmarks ["2.47", "4.7", "12.13", "18.66"]
        if (Array.isArray(parsed) && parsed.length === 4 && parsed.join(',') === '2.47,4.7,12.13,18.66') {
          localStorage.setItem('gita_bookmarks', JSON.stringify([]));
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [dailyVerseModalOpen, setDailyVerseModalOpen] = useState<boolean>(false);
  const [dailyReminderEnabled, setDailyReminderEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('gita_daily_reminder');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const setDailyReminderEnabled = useCallback((enabled: boolean) => {
    setDailyReminderEnabledState(enabled);
    localStorage.setItem('gita_daily_reminder', JSON.stringify(enabled));
  }, []);

  const [lastRead, setLastReadState] = useState<{ chapter: number; verse: number }>(() => {
    const saved = localStorage.getItem('gita_lastRead');
    return saved ? JSON.parse(saved) : { chapter: 2, verse: 47 };
  });

  // Real-time Reading History (starts empty, records real shlokas read)
  const [readingHistory, setReadingHistory] = useState<{ chapter: number; verse: number; date: string }[]>(() => {
    const saved = localStorage.getItem('gita_readingHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear dummy mockup history
        if (Array.isArray(parsed) && parsed.length === 3 && parsed[0]?.date === 'Today' && parsed[1]?.date === 'Yesterday') {
          localStorage.setItem('gita_readingHistory', JSON.stringify([]));
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gita_language', lang);
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('gita_textSize', size);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('gita_userName', name);
  };

  const setIsGoogleLinked = (linked: boolean) => {
    setIsGoogleLinkedState(linked);
    localStorage.setItem('gita_google_linked', linked ? 'true' : 'false');
  };

  const setOnboardingCompleted = (completed: boolean) => {
    setOnboardingCompletedState(completed);
    localStorage.setItem('gita_onboarding_completed', completed ? 'true' : 'false');
  };

  const setTheme = (tMode: ThemeMode) => {
    setThemeState(tMode);
    localStorage.setItem('gita_theme', tMode);
    if (tMode === 'dark' || (tMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateNativeStatusBar(tMode);
  };

  const setLastRead = useCallback((pos: { chapter: number; verse: number }) => {
    setLastReadState(prev => {
      if (prev.chapter === pos.chapter && prev.verse === pos.verse) return prev;
      localStorage.setItem('gita_lastRead', JSON.stringify(pos));
      syncDevoteeProgress({ lastRead: pos });
      return pos;
    });
  }, []);

  const toggleBookmark = (verseId: string) => {
    setBookmarks(prev => {
      const exists = prev.includes(verseId);
      const updated = exists ? prev.filter(id => id !== verseId) : [...prev, verseId];
      localStorage.setItem('gita_bookmarks', JSON.stringify(updated));
      syncDevoteeProgress({ bookmarks: updated, lastRead });
      return updated;
    });
  };

  const isBookmarked = (verseId: string): boolean => {
    return bookmarks.includes(verseId);
  };

  const navigateToShloka = (chapter: number, verse: number) => {
    setSelectedChapter(chapter);
    setSelectedVerse(verse);
    setLastRead({ chapter, verse });
    setReadingHistory(prev => {
      const updated = [
        { chapter, verse, date: 'Just now' },
        ...prev.filter(item => !(item.chapter === chapter && item.verse === verse))
      ].slice(0, 30);
      localStorage.setItem('gita_readingHistory', JSON.stringify(updated));
      return updated;
    });
    setCurrentScreen('shloka');
  };

  // Real-time unique listened verses (1 point per verse forever, no duplicates)
  const [listenedVerses, setListenedVerses] = useState<string[]>(() => {
    const saved = localStorage.getItem('gita_listened_verses');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const streakInfo = getStoredStreak();

  // Permanent, cumulative Sadhana Karma Points that NEVER decrease even if a streak resets
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(() => {
    const raw = localStorage.getItem('gita_accumulated_sadhana_points');
    const parsed = raw ? parseInt(raw, 10) : 0;
    const streak = getStoredStreak();
    const computed = (listenedVerses?.length || 0) + (streak.currentStreak * 5);
    // Explicitly restore to at least 12 points as previously earned
    const initial = Math.max(parsed || 0, computed, 12);
    localStorage.setItem('gita_accumulated_sadhana_points', String(initial));
    return initial;
  });

  const sadhanaPoints = Math.max(accumulatedPoints, listenedVerses.length + (streakInfo.currentStreak * 5));

  const awardListenPoint = useCallback((chapter: number, verse: number): boolean => {
    const verseKey = `${chapter}.${verse}`;
    const saved = localStorage.getItem('gita_listened_verses');
    const currentList: string[] = saved ? JSON.parse(saved) : [];

    if (!currentList.includes(verseKey)) {
      const updated = [...currentList, verseKey];
      setListenedVerses(updated);
      localStorage.setItem('gita_listened_verses', JSON.stringify(updated));

      const streak = getStoredStreak();
      const nextPoints = Math.max(accumulatedPoints + 1, updated.length + (streak.currentStreak * 5));
      setAccumulatedPoints(nextPoints);
      localStorage.setItem('gita_accumulated_sadhana_points', String(nextPoints));

      showToast(`+1 Sadhana Point! ✨ (${nextPoints} pts)`);

      syncDevoteeProgress({
        points: nextPoints,
        listenedVerses: updated,
        streak: streak.currentStreak,
        lastRead,
        bookmarks,
      });
      return true;
    }
    return false;
  }, [accumulatedPoints, lastRead, bookmarks, showToast]);

  const deleteAccountAndResetData = useCallback(async (): Promise<boolean> => {
    try {
      const res = await deleteUserAccount();
      resetStoredStreak();
      localStorage.removeItem('gita_accumulated_sadhana_points');
      setAccumulatedPoints(0);

      // Reset all in-memory React state
      setUserNameState('');
      setIsGoogleLinkedState(false);
      setOnboardingCompletedState(false);
      setBookmarks([]);
      setReadingHistory([]);
      setListenedVerses([]);
      setLastReadState({ chapter: 2, verse: 47 });
      setCurrentScreenState('welcome');
      setNavStack(['welcome']);

      showToast('🕉️ Account and sacred progress deleted.');
      return res.success;
    } catch (err) {
      console.error('Error during full account deletion:', err);
      showToast('Unable to complete account deletion.');
      return false;
    }
  }, [showToast]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  useEffect(() => {
    setTheme(theme);

    // Synchronize Supabase user, profile, streak & cloud bookmarks on startup
    const syncUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsGoogleLinked(true);
          const profile = await fetchUserProfile(session.user.id);
          if (profile?.username) {
            setUserName(profile.username);
          }
          if (profile?.last_read) {
            if (profile.last_read.chapter && profile.last_read.verse) {
              setLastReadState({ chapter: profile.last_read.chapter, verse: profile.last_read.verse });
              localStorage.setItem('gita_lastRead', JSON.stringify({ chapter: profile.last_read.chapter, verse: profile.last_read.verse }));
            }
            const cloudBookmarks = (profile.last_read as Record<string, unknown>)?.bookmarks;
            if (Array.isArray(cloudBookmarks) && cloudBookmarks.length > 0) {
              setBookmarks(cloudBookmarks as string[]);
              localStorage.setItem('gita_bookmarks', JSON.stringify(cloudBookmarks));
            }
            const cloudListened = (profile.last_read as Record<string, unknown>)?.listened_verses;
            if (Array.isArray(cloudListened) && cloudListened.length > 0) {
              setListenedVerses(cloudListened as string[]);
              localStorage.setItem('gita_listened_verses', JSON.stringify(cloudListened));
            }
          }
        }
      } catch (err) {
        console.warn('Supabase initial session check error:', err);
      }
    };
    syncUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setIsGoogleLinked(true);
        const profile = await fetchUserProfile(session.user.id);
        if (profile?.username) {
          setUserName(profile.username);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsGoogleLinked(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Automatically schedule daily early morning Gita quotes (6:30 AM) in user's selected language
  useEffect(() => {
    scheduleDailyMorningQuotes(language, dailyReminderEnabled);
  }, [language, dailyReminderEnabled]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        textSize,
        setTextSize,
        theme,
        setTheme,
        currentScreen,
        setCurrentScreen,
        goBack,
        selectedChapter,
        setSelectedChapter,
        selectedVerse,
        setSelectedVerse,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        dailyVerseModalOpen,
        setDailyVerseModalOpen,
        dailyReminderEnabled,
        setDailyReminderEnabled,
        lastRead,
        setLastRead,
        readingHistory,
        navigateToShloka,
        t,
        openSettingsFromScreen,
        setOpenSettingsFromScreen,
        userName,
        setUserName,
        isGoogleLinked,
        setIsGoogleLinked,
        onboardingCompleted,
        setOnboardingCompleted,
        screenDirection,
        listenedVerses,
        awardListenPoint,
        sadhanaPoints,
        toastMessage,
        showToast,
        deleteAccountAndResetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

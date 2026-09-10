import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TextSize, ThemeMode, ScreenType } from '../types';
import { UI_TRANSLATIONS, UIStrings } from '../data/translations';
import { updateNativeStatusBar } from '../utils/native';

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

  const setCurrentScreen = (screen: ScreenType) => {
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
      const nextStack = [...navStack];
      nextStack.pop();
      const previousScreen = nextStack[nextStack.length - 1];
      setNavStack(nextStack);
      setCurrentScreenState(previousScreen);
      return true;
    }

    // 4. Return to home if on secondary screen
    if (currentScreen !== 'home' && currentScreen !== 'welcome') {
      setCurrentScreenState('home');
      setNavStack(['home']);
      return true;
    }

    // Base screen (home or welcome)
    return false;
  };

  // User Profile Name (default "Dhanush" matching storyboard screen 3)
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('gita_userName') || 'Dhanush';
  });

  const [isGoogleLinked, setIsGoogleLinkedState] = useState<boolean>(() => {
    return localStorage.getItem('gita_google_linked') === 'true';
  });

  const [selectedChapter, setSelectedChapter] = useState<number>(2);
  const [selectedVerse, setSelectedVerse] = useState<number>(47);

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('gita_bookmarks');
    return saved ? JSON.parse(saved) : ["2.47", "4.7", "12.13", "18.66"];
  });

  const [dailyVerseModalOpen, setDailyVerseModalOpen] = useState<boolean>(false);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState<boolean>(true);

  const [lastRead, setLastReadState] = useState<{ chapter: number; verse: number }>(() => {
    const saved = localStorage.getItem('gita_lastRead');
    return saved ? JSON.parse(saved) : { chapter: 2, verse: 47 };
  });

  const [readingHistory, setReadingHistory] = useState<{ chapter: number; verse: number; date: string }[]>([
    { chapter: 2, verse: 47, date: 'Today' },
    { chapter: 4, verse: 7, date: 'Yesterday' },
    { chapter: 6, verse: 5, date: '2 days ago' }
  ]);

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

  const setLastRead = (pos: { chapter: number; verse: number }) => {
    setLastReadState(pos);
    localStorage.setItem('gita_lastRead', JSON.stringify(pos));
  };

  const toggleBookmark = (verseId: string) => {
    setBookmarks(prev => {
      const exists = prev.includes(verseId);
      const updated = exists ? prev.filter(id => id !== verseId) : [...prev, verseId];
      localStorage.setItem('gita_bookmarks', JSON.stringify(updated));
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
    setReadingHistory(prev => [
      { chapter, verse, date: 'Just now' },
      ...prev.filter(item => !(item.chapter === chapter && item.verse === verse))
    ].slice(0, 20));
    setCurrentScreen('shloka');
  };

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  useEffect(() => {
    setTheme(theme);
  }, []);

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

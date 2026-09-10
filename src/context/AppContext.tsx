import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TextSize, ThemeMode, ScreenType } from '../types';
import { UI_TRANSLATIONS, UIStrings } from '../data/translations';
import { CHAPTERS_DATA } from '../data/chapters';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Telugu ('te') as pictured in user's design!
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gita_language') as Language) || 'te';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    return (localStorage.getItem('gita_textSize') as TextSize) || 'md';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('gita_theme') as ThemeMode) || 'light';
  });

  // Current navigation screen: starts on 'welcome' (screen 1 in reference mockup)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [openSettingsFromScreen, setOpenSettingsFromScreen] = useState<ScreenType | null>(null);

  // Default reading position: Chapter 2, Verse 47 as highlighted in user's mockup
  const [selectedChapter, setSelectedChapter] = useState<number>(2);
  const [selectedVerse, setSelectedVerse] = useState<number>(47);

  // Bookmarks: pre-populated with the exact 4 verses from Screen 6 of the mockup!
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

  const setTheme = (tMode: ThemeMode) => {
    setThemeState(tMode);
    localStorage.setItem('gita_theme', tMode);
    if (tMode === 'dark' || (tMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  // Initialize theme on mount
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

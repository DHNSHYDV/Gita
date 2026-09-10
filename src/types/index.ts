export type Language = 'te' | 'en' | 'hi' | 'ta' | 'kn';

export type TextSize = 'sm' | 'md' | 'lg';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Chapter {
  id: number;
  number: number;
  versesCount: number;
  title: Record<Language, string>;
  nameMeaning: Record<Language, string>;
  summary: Record<Language, string>;
}

export interface VerseTranslation {
  scriptShloka: string;      // The Sanskrit verse written in the specific language script
  translation: string;       // భావార్థం (Word/Sentence meaning)
  purport: string;           // సారాంశం (Essence & philosophical commentary)
}

export interface Verse {
  id: string; // e.g. "2.47"
  chapterNumber: number;
  verseNumber: number;
  sanskrit: string;          // Sanskrit Devanagari original
  transliteration: string;   // IAST / English Roman transliteration
  translations: Record<Language, VerseTranslation>;
}

export interface BookmarkItem {
  id: string; // "chapter.verse", e.g. "2.47"
  chapterNumber: number;
  verseNumber: number;
  shlokaPreview: string;
  chapterTitle: string;
  savedAt: string;
}

export type ScreenType = 
  | 'welcome'
  | 'onboarding-language'
  | 'onboarding-username'
  | 'onboarding-auth'
  | 'onboarding-success'
  | 'home'
  | 'chapters'
  | 'shloka'
  | 'settings'
  | 'bookmarks'
  | 'streaks'
  | 'more'
  | 'reading-history';

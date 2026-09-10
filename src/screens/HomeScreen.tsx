import React, { useState } from 'react';
import { Search, User, ChevronRight, Sparkles, BookOpen, Bookmark, Flame, MoreHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { getStoredStreak } from '../data/db';

export const HomeScreen: React.FC = () => {
  const {
    language,
    setCurrentScreen,
    navigateToShloka,
    lastRead,
    t,
    setDailyVerseModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get chapter 2 info for continue reading card
  const lastReadChapter = CHAPTERS_DATA.find(c => c.number === lastRead.chapter) || CHAPTERS_DATA[1];
  const streakInfo = getStoredStreak();
  
  // First 4 chapters for the 2x2 preview grid
  const previewChapters = CHAPTERS_DATA.slice(0, 4);

  // Filtered chapters if search is active
  const filteredChapters = searchQuery.trim()
    ? CHAPTERS_DATA.filter(c => 
        c.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.number.toString() === searchQuery.trim()
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-5 pt-6 pb-4 flex items-center justify-between border-b border-[#EAE2D5]/60 dark:border-[#2A241E]/60">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2B2113] dark:text-[#F3E6D0]">
            {t.appName}
          </h1>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59341]"></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2.5 rounded-full text-[#6E6353] dark:text-[#B0A595] hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentScreen('more')}
            className="p-2 rounded-full border border-[#DED4C5] dark:border-[#383126] text-[#6E6353] dark:text-[#B0A595] hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
            title="Profile & More"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Optional Search Bar dropdown */}
      {isSearchOpen && (
        <div className="px-5 py-3 bg-[#EFE7DA] dark:bg-[#1C1814] border-b border-[#E0D5C3] dark:border-[#2C251C] animate-fadeIn">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-[#8A7E6C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoFocus
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white dark:bg-[#26201A] border border-[#D5C9B7] dark:border-[#3E3427] focus:outline-none focus:ring-2 focus:ring-[#C59341] text-[#2A241E] dark:text-[#FAF7F2]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#8A7E6C] hover:text-[#2A241E]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
              {filteredChapters.length > 0 ? (
                filteredChapters.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigateToShloka(c.number, 1);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-[#26201A] text-xs flex justify-between items-center cursor-pointer hover:bg-[#F8F2E8] dark:hover:bg-[#332A20]"
                  >
                    <span className="font-medium">{c.number}. {c.title[language]}</span>
                    <span className="text-[#968977]">{c.versesCount} {t.shlokasCountLabel}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8A7E6C] text-center py-2">No chapters found</p>
              )}
            </div>
          )}
        </div>
      )}

      <main className="px-5 pt-4 space-y-5">
        {/* Daily Quote Card (Warm glowing card as in mockup) */}
        <div
          onClick={() => setDailyVerseModalOpen(true)}
          className="relative overflow-hidden rounded-2xl cursor-pointer p-6 bg-gradient-to-br from-[#FDF6EA] via-[#F7EBD6] to-[#EED9B7] dark:from-[#2A2218] dark:via-[#221B13] dark:to-[#1C1610] border border-[#E8D4B4] dark:border-[#3D3021] shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          {/* Subtle decorative lotus/sun watermark */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-15 pointer-events-none text-[#9E6F22] dark:text-[#C59341]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="30" />
              <path d="M50 0 L55 30 L85 15 L65 40 L95 50 L65 60 L85 85 L55 70 L50 100 L45 70 L15 85 L35 60 L5 50 L35 40 L15 15 L45 30 Z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#966C28] dark:text-[#DDB876] mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.dailyQuoteTitle}</span>
            </div>

            <p className="font-serif text-lg md:text-xl font-medium text-[#2E2417] dark:text-[#F3E7D3] leading-relaxed max-w-xs">
              "కర్తవ్యమే చేయుము, ఫలంపై ఆసక్తి పెట్టుకు."
            </p>

            <span className="mt-3 text-xs text-[#7A6A52] dark:text-[#B5A48B] font-medium tracking-wide">
              – భగవద్గీత 2.47
            </span>
          </div>
        </div>

        {/* Continue Reading Card */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7E7363] dark:text-[#9F9484] mb-2 px-1">
            {t.continueReading}
          </h2>

          <div
            onClick={() => navigateToShloka(lastRead.chapter, lastRead.verse)}
            className="rounded-2xl p-4 bg-[#EDE3D3] dark:bg-[#1F1B15] border border-[#DDD0BC] dark:border-[#332A1E] flex items-center justify-between cursor-pointer hover:bg-[#E7DBC9] dark:hover:bg-[#27221A] transition-colors group shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-base text-[#2A231A] dark:text-[#FAF7F2]">
                {t.chapterLabel} {lastReadChapter.number} {lastReadChapter.title[language]}
              </h3>
              <p className="text-xs text-[#786C5A] dark:text-[#A89C8B] mt-0.5">
                {t.lastRead}: {t.shlokaLabel} {lastRead.verse}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/70 dark:bg-[#2E271D] flex items-center justify-center text-[#786C5A] dark:text-[#E8C581] group-hover:translate-x-0.5 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Quick Access Row */}
        <div>
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => setCurrentScreen('chapters')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EDE3D3]/70 dark:bg-[#1F1B15] border border-[#DDD0BC] dark:border-[#332A1E] hover:bg-[#E5D8C4] dark:hover:bg-[#28221A] transition-all group shadow-sm active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-[#E4D5BE] dark:bg-[#2C241A] flex items-center justify-center text-[#8A5A1B] dark:text-[#E8C581] mb-1.5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-[#4A3E2E] dark:text-[#D5C6B1] text-center truncate max-w-full">
                {t.tabChapters}
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('bookmarks')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EDE3D3]/70 dark:bg-[#1F1B15] border border-[#DDD0BC] dark:border-[#332A1E] hover:bg-[#E5D8C4] dark:hover:bg-[#28221A] transition-all group shadow-sm active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-[#E4D5BE] dark:bg-[#2C241A] flex items-center justify-center text-[#8A5A1B] dark:text-[#E8C581] mb-1.5 group-hover:scale-110 transition-transform">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-[#4A3E2E] dark:text-[#D5C6B1] text-center truncate max-w-full">
                {t.tabBookmarks}
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('streaks')}
              className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EDE3D3]/70 dark:bg-[#1F1B15] border border-[#DDD0BC] dark:border-[#332A1E] hover:bg-[#E5D8C4] dark:hover:bg-[#28221A] transition-all group shadow-sm active:scale-95"
            >
              <div className="relative w-10 h-10 rounded-full bg-[#FCE8D4] dark:bg-[#341F14] flex items-center justify-center text-[#D95B12] dark:text-[#F88D48] mb-1.5 group-hover:scale-110 transition-transform shadow-inner">
                <Flame className="w-5 h-5 fill-[#D95B12]/20" />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#C2410C] text-[9px] font-bold text-white rounded-full">
                  {streakInfo.currentStreak}d
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#4A3E2E] dark:text-[#D5C6B1] text-center truncate max-w-full">
                Streaks
              </span>
            </button>

            <button
              onClick={() => setCurrentScreen('more')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EDE3D3]/70 dark:bg-[#1F1B15] border border-[#DDD0BC] dark:border-[#332A1E] hover:bg-[#E5D8C4] dark:hover:bg-[#28221A] transition-all group shadow-sm active:scale-95"
            >
              <div className="w-10 h-10 rounded-full bg-[#E4D5BE] dark:bg-[#2C241A] flex items-center justify-center text-[#8A5A1B] dark:text-[#E8C581] mb-1.5 group-hover:scale-110 transition-transform">
                <MoreHorizontal className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-[#4A3E2E] dark:text-[#D5C6B1] text-center truncate max-w-full">
                {t.tabMore}
              </span>
            </button>
          </div>
        </div>

        {/* All Chapters Section Header */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-[#2A231A] dark:text-[#F3E6D0]">
              {t.allChapters}
            </h2>
            <button
              onClick={() => setCurrentScreen('chapters')}
              className="text-xs font-semibold text-[#966C28] dark:text-[#E8C581] hover:underline flex items-center gap-0.5"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2x2 Grid of Chapters */}
          <div className="grid grid-cols-2 gap-3">
            {previewChapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => navigateToShloka(chapter.number, 1)}
                className="rounded-2xl p-3.5 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] hover:border-[#C59341]/60 dark:hover:border-[#C59341]/60 transition-all cursor-pointer shadow-sm hover:shadow group flex flex-col justify-between h-28"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#EFE8DD] dark:bg-[#2A2319] text-[#4A3F30] dark:text-[#D8C7AA] text-xs font-bold flex items-center justify-center">
                    {chapter.number}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#A89D8D] group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-[#2B2319] dark:text-[#F0E5D4] line-clamp-1">
                    {chapter.title[language]}
                  </h4>
                  <p className="text-[11px] text-[#867B6C] dark:text-[#9D9180] mt-0.5">
                    {chapter.versesCount} {t.shlokasCountLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

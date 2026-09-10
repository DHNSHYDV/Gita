import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark as BookmarkIcon, ChevronRight, ChevronLeft, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { getVerse } from '../data/verses';

export const BookmarksScreen: React.FC = () => {
  const { language, bookmarks, toggleBookmark, navigateToShloka, goBack, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Map bookmark IDs ("2.47") to verse data & chapter title
  const bookmarkItems = bookmarks.map(id => {
    const [chapStr, verseStr] = id.split('.');
    const chapterNumber = parseInt(chapStr, 10);
    const verseNumber = parseInt(verseStr, 10);
    const chapter = CHAPTERS_DATA.find(c => c.number === chapterNumber) || CHAPTERS_DATA[1];
    const verse = getVerse(chapterNumber, verseNumber);
    const trans = verse.translations[language] || verse.translations.en;
    const snippet = trans.scriptShloka.split('\n')[0].replace(/[|।॥]/g, '').trim();

    return {
      id,
      chapterNumber,
      verseNumber,
      chapterTitle: chapter.title[language],
      snippet: snippet.length > 32 ? snippet.slice(0, 32) + '...' : snippet,
    };
  });

  const filteredBookmarks = searchQuery.trim()
    ? bookmarkItems.filter(item =>
        item.id.includes(searchQuery) ||
        item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookmarkItems;

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 select-none transition-colors">
      {/* Header - Brought 1 cm below top to keep blank safe region */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))] pb-3 flex items-center justify-between border-b border-[#EAE2D5] dark:border-[#28221B]">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={goBack}
            className="p-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors text-[#2A241E] dark:text-[#FAF7F2]"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.75]" />
          </motion.button>
          <h1 className="font-serif font-bold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
            {t.myBookmarks}
          </h1>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verses..."
            className="w-32 focus:w-48 transition-all duration-300 pl-7 pr-2.5 py-1 text-xs rounded-full bg-[#EFE8DD] dark:bg-[#25201A] border border-[#DCD0BE] dark:border-[#383023] focus:outline-none focus:ring-1 focus:ring-[#C59341] text-[#2A241E] dark:text-[#FAF7F2]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 text-[#8A7E6C] pointer-events-none" />
        </div>
      </header>

      {/* Bookmarks List */}
      <main className="px-5 py-4 space-y-3 max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                onClick={() => navigateToShloka(item.chapterNumber, item.verseNumber)}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] hover:border-[#C59341]/60 dark:hover:border-[#C59341]/60 cursor-pointer shadow-xs hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  {/* Bookmark Gold Ribbon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-[#F4EADB] dark:bg-[#2C2419] flex items-center justify-center flex-shrink-0 text-[#C59341] dark:text-[#E8C581] shadow-2xs">
                    <BookmarkIcon className="w-5 h-5 fill-current" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#2A241E] dark:text-[#FAF7F2]">
                        {item.id}
                      </span>
                      <span className="font-medium text-xs text-[#5A4E3D] dark:text-[#D5C7B5] truncate">
                        {item.snippet}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A7E6C] dark:text-[#9B8F7D] mt-0.5 truncate font-serif">
                      {item.chapterTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(item.id);
                    }}
                    className="p-2 text-[#A89D8D] hover:text-rose-600 transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.75]" />
                  </motion.button>
                  <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 group-hover:text-[#C59341] dark:group-hover:text-[#E8C581] transition-all" />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-6 space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#EFE7D8] dark:bg-[#251E17] flex items-center justify-center mx-auto text-[#C59341]">
                <BookmarkIcon className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2A241E] dark:text-[#FAF7F2]">
                No Bookmarks Yet
              </h3>
              <p className="text-xs text-[#7A6E5D] dark:text-[#9F9382] max-w-xs mx-auto leading-relaxed">
                {t.emptyBookmarks}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

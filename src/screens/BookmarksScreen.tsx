import React, { useState } from 'react';
import { Bookmark as BookmarkIcon, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { getVerse } from '../data/verses';

export const BookmarksScreen: React.FC = () => {
  const { language, bookmarks, toggleBookmark, navigateToShloka, t } = useApp();
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
      snippet: snippet.length > 28 ? snippet.slice(0, 28) + '...' : snippet,
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
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-5 pt-6 pb-4 flex items-center justify-between border-b border-[#EAE2D5] dark:border-[#28221B]">
        <h1 className="font-semibold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          {t.myBookmarks}
        </h1>

        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-28 focus:w-44 transition-all duration-200 pl-7 pr-2 py-1 text-xs rounded-full bg-[#EFE8DD] dark:bg-[#25201A] border border-[#DCD0BE] dark:border-[#383023] focus:outline-none focus:ring-1 focus:ring-[#C59341]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 text-[#8A7E6C] pointer-events-none" />
        </div>
      </header>

      {/* Bookmarks List */}
      <main className="px-5 py-4 space-y-3">
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateToShloka(item.chapterNumber, item.verseNumber)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] hover:border-[#C59341]/60 dark:hover:border-[#C59341]/60 cursor-pointer shadow-sm hover:shadow transition-all group"
            >
              <div className="flex items-center gap-3.5">
                {/* Bookmark Gold Ribbon Badge */}
                <div className="w-10 h-10 rounded-xl bg-[#F4EADB] dark:bg-[#2C2419] flex items-center justify-center flex-shrink-0 text-[#966C28] dark:text-[#E8C581]">
                  <BookmarkIcon className="w-5 h-5 fill-current" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2A241E] dark:text-[#FAF7F2]">
                      {item.id}
                    </span>
                    <span className="font-medium text-xs text-[#2A241E] dark:text-[#FAF7F2] truncate max-w-[170px]">
                      {item.snippet}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E6C] dark:text-[#9B8F7D] mt-0.5">
                    {item.chapterTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#A89D8D] hover:text-rose-600 transition-opacity"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 group-hover:text-[#966C28] dark:group-hover:text-[#E8C581] transition-all" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-4">
            <BookmarkIcon className="w-12 h-12 mx-auto text-[#C5B8A6] dark:text-[#4A3F31] mb-3 stroke-1" />
            <p className="text-sm font-medium text-[#7A6E5D] dark:text-[#9F9382]">
              {t.emptyBookmarks}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

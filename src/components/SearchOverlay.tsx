import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, BookOpen, ArrowRight, Sparkles, BookMarked, Hash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { VERSES_DATA, getVerse } from '../data/verses';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { language, navigateToShloka, t } = useApp();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'chapters' | 'shlokas'>('all');

  // Parse direct verse reference: "2.47", "2:47", "2 47", "chapter 2 verse 47", "bg 2.47"
  const directVerseMatch = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    // Pattern 1: "2.47", "2:47", "2-47", "2/47"
    let match = trimmed.match(/^(?:bg|gita)?\s*(?:ch(?:apter)?)?\s*(\d{1,2})\s*[:.\-\/\s]\s*(?:v(?:erse)?|s(?:hloka)?)?\s*(\d{1,3})$/i);

    if (!match) {
      // Pattern 2: "chapter 2 verse 47" or "ch 2 47"
      match = trimmed.match(/(?:chapter|ch)\s*(\d{1,2})\s*(?:verse|v|shloka|s)?\s*(\d{1,3})/i);
    }

    if (match) {
      const cNum = parseInt(match[1], 10);
      const vNum = parseInt(match[2], 10);
      if (cNum >= 1 && cNum <= 18) {
        const chapter = CHAPTERS_DATA.find(c => c.number === cNum);
        if (chapter && vNum >= 1 && vNum <= chapter.versesCount) {
          const verse = getVerse(cNum, vNum);
          const trans = verse.translations[language] || verse.translations.en;
          return {
            chapterNumber: cNum,
            verseNumber: vNum,
            chapterTitle: chapter.title[language] || chapter.title.en,
            sanskritSnippet: trans.scriptShloka.split('\n')[0].replace(/[|।॥]/g, '').trim(),
            meaningSnippet: trans.translation.slice(0, 90) + '...',
          };
        }
      }
    }
    return null;
  }, [query, language]);

  // Search Chapters
  const chapterResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Check if query is just a single number "1" - "18"
    const num = parseInt(q, 10);
    const isSingleNum = !isNaN(num) && num >= 1 && num <= 18 && q === num.toString();

    return CHAPTERS_DATA.filter(chapter => {
      if (isSingleNum) {
        return chapter.number === num;
      }
      // Match by number
      if (chapter.number.toString() === q) return true;
      // Match by title in all languages
      const titles = Object.values(chapter.title).join(' ').toLowerCase();
      if (titles.includes(q)) return true;
      // Match by name meaning
      const meanings = Object.values(chapter.nameMeaning).join(' ').toLowerCase();
      if (meanings.includes(q)) return true;
      // Match by summary
      const summaries = Object.values(chapter.summary).join(' ').toLowerCase();
      if (summaries.includes(q)) return true;

      return false;
    });
  }, [query]);

  // Search Shlokas / Verses
  const shlokaResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    // 1. Search in curated VERSES_DATA
    const matches: {
      chapterNumber: number;
      verseNumber: number;
      id: string;
      chapterTitle: string;
      snippet: string;
      meaning: string;
    }[] = [];

    VERSES_DATA.forEach(verse => {
      const id = verse.id;
      const trans = verse.translations[language] || verse.translations.en;
      const allText = [
        id,
        verse.sanskrit,
        verse.transliteration,
        trans.scriptShloka,
        trans.translation,
        trans.purport,
        // Also check English translation for universal search
        verse.translations.en.translation,
        verse.translations.en.purport,
      ].join(' ').toLowerCase();

      if (allText.includes(q)) {
        const chapter = CHAPTERS_DATA.find(c => c.number === verse.chapterNumber) || CHAPTERS_DATA[1];
        matches.push({
          chapterNumber: verse.chapterNumber,
          verseNumber: verse.verseNumber,
          id: verse.id,
          chapterTitle: chapter.title[language] || chapter.title.en,
          snippet: trans.scriptShloka.split('\n')[0].replace(/[|।॥]/g, '').trim(),
          meaning: trans.translation.slice(0, 100) + '...',
        });
      }
    });

    return matches.slice(0, 50);
  }, [query, language]);

  // Popular / Featured suggestions when query is empty
  const popularVerses = [
    { chapter: 2, verse: 47, label: "2.47", topic: "Nishkama Karma (Right to Action)" },
    { chapter: 4, verse: 7, label: "4.7", topic: "Yada Yada Hi Dharmasya (Avatarana)" },
    { chapter: 6, verse: 5, label: "6.5", topic: "Mind as Friend and Enemy" },
    { chapter: 9, verse: 22, label: "9.22", topic: "Yoga-Kshema (Divine Protection)" },
    { chapter: 2, verse: 20, label: "2.20", topic: "Immortality of the Eternal Soul" },
  ];

  const popularChapters = [
    { number: 2, name: "Sankhya Yoga (Wisdom)" },
    { number: 3, name: "Karma Yoga (Action)" },
    { number: 6, name: "Dhyana Yoga (Meditation)" },
    { number: 12, name: "Bhakti Yoga (Devotion)" },
    { number: 18, name: "Moksha Yoga (Liberation)" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] flex flex-col transition-colors select-none"
      >
        {/* Top Search Header with 1.1 cm blank safe space */}
        <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))] pb-3 border-b border-[#EAE2D5] dark:border-[#28221B]">
          <div className="flex items-center gap-2 max-w-md mx-auto w-full">
            {/* Search Input Card */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#8A7E6C] pointer-events-none" strokeWidth={2} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chapter, verse (e.g. 2.47), or topic..."
                autoFocus
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-2xl bg-[#EFE8DD] dark:bg-[#201B15] border border-[#D5C9B7] dark:border-[#382F24] focus:outline-none focus:ring-2 focus:ring-[#C59341] text-[#2A241E] dark:text-[#FAF7F2] placeholder-[#8A7E6C] transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 rounded-full text-[#8A7E6C] hover:text-[#2A241E] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cancel / Close Button */}
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-[#8C6D3F] dark:text-[#E8C581] hover:text-[#2A241E] transition-colors active:scale-95"
            >
              Cancel
            </button>
          </div>

          {/* Filter Pills: All | Chapters | Shlokas */}
          <div className="flex items-center gap-2 mt-3 max-w-md mx-auto w-full">
            {(['all', 'chapters', 'shlokas'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                  filterType === type
                    ? 'bg-[#C59341] text-white shadow-xs font-semibold'
                    : 'bg-[#EFE8DD] dark:bg-[#231E18] text-[#7A6E5D] dark:text-[#9F9382] hover:bg-[#EAE0D0]'
                }`}
              >
                {type === 'all' ? 'All Results' : type}
              </button>
            ))}
          </div>
        </header>

        {/* Search Results / Suggestion Body */}
        <main className="flex-1 overflow-y-auto px-5 py-4 max-w-md mx-auto w-full space-y-4 pb-20">
          {/* 1. Direct Verse Jump Card */}
          {directVerseMatch && (filterType === 'all' || filterType === 'shlokas') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigateToShloka(directVerseMatch.chapterNumber, directVerseMatch.verseNumber);
                onClose();
              }}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF0DE] to-[#F5E2C4] dark:from-[#2E2417] dark:to-[#221A11] border-2 border-[#C59341] shadow-sm cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C59341] text-white text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3 h-3" />
                  Direct Verse Jump
                </span>
                <span className="text-xs font-bold text-[#8C6D3F] dark:text-[#E8C581] flex items-center gap-1">
                  Read Shloka <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#2A241E] dark:text-[#FAF7F2]">
                Chapter {directVerseMatch.chapterNumber}, Shloka {directVerseMatch.verseNumber}
              </h3>
              <p className="text-xs text-[#7A6E5D] dark:text-[#B5A591] font-serif italic mt-0.5">
                "{directVerseMatch.sanskritSnippet}"
              </p>
              <p className="text-xs text-[#5A4E3D] dark:text-[#D5C7B5] mt-1.5 line-clamp-2">
                {directVerseMatch.meaningSnippet}
              </p>
            </motion.div>
          )}

          {/* 2. When query is empty: Show Popular Chapters & Verses */}
          {!query.trim() && (
            <div className="space-y-5 pt-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9B8F7D] mb-2.5 flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59341]" />
                  Popular Shlokas
                </h3>
                <div className="space-y-2">
                  {popularVerses.map(item => (
                    <motion.div
                      key={item.label}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigateToShloka(item.chapter, item.verse);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] flex items-center justify-between cursor-pointer hover:border-[#C59341]/60 transition-colors shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F4EADB] dark:bg-[#2C2419] flex items-center justify-center text-xs font-bold text-[#C59341]">
                          {item.label}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-xs md:text-sm text-[#2A241E] dark:text-[#FAF7F2]">
                            Chapter {item.chapter}, Verse {item.verse}
                          </p>
                          <p className="text-[11px] text-[#8A7E6C] dark:text-[#9B8F7D]">
                            {item.topic}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#B0A595] group-hover:translate-x-0.5 group-hover:text-[#C59341] transition-all" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9B8F7D] mb-2.5 flex items-center gap-1.5 font-serif">
                  <BookOpen className="w-3.5 h-3.5 text-[#C59341]" />
                  Key Chapters
                </h3>
                <div className="space-y-2">
                  {popularChapters.map(c => (
                    <motion.div
                      key={c.number}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigateToShloka(c.number, 1);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] flex items-center justify-between cursor-pointer hover:border-[#C59341]/60 transition-colors shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#EFE8DD] dark:bg-[#25201A] flex items-center justify-center text-xs font-bold text-[#8C6D3F] dark:text-[#E8C581]">
                          {c.number}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-xs md:text-sm text-[#2A241E] dark:text-[#FAF7F2]">
                            Chapter {c.number}
                          </p>
                          <p className="text-[11px] text-[#8A7E6C] dark:text-[#9B8F7D]">
                            {c.name}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#B0A595] group-hover:translate-x-0.5 group-hover:text-[#C59341] transition-all" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Filtered Chapters Section */}
          {query.trim() && (filterType === 'all' || filterType === 'chapters') && chapterResults.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9B8F7D] px-1 font-serif">
                Chapters ({chapterResults.length})
              </h3>
              {chapterResults.map(c => (
                <motion.div
                  key={c.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigateToShloka(c.number, 1);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] hover:border-[#C59341]/60 flex items-center justify-between cursor-pointer shadow-2xs group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-9 h-9 rounded-xl bg-[#F2E5D0] dark:bg-[#2C2317] flex items-center justify-center font-serif font-bold text-sm text-[#8C6D3F] dark:text-[#E8C581] flex-shrink-0">
                      {c.number}
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-sm text-[#2A241E] dark:text-[#FAF7F2] truncate">
                        {c.title[language] || c.title.en}
                      </p>
                      <p className="text-[11px] text-[#8A7E6C] dark:text-[#9B8F7D] truncate">
                        {c.nameMeaning[language] || c.nameMeaning.en} • {c.versesCount} shlokas
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B0A595] group-hover:translate-x-0.5 group-hover:text-[#C59341] transition-all flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          )}

          {/* 4. Filtered Shlokas Section */}
          {query.trim() && (filterType === 'all' || filterType === 'shlokas') && shlokaResults.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9B8F7D] px-1 font-serif">
                Shlokas ({shlokaResults.length})
              </h3>
              {shlokaResults.map(item => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigateToShloka(item.chapterNumber, item.verseNumber);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] hover:border-[#C59341]/60 flex items-center justify-between cursor-pointer shadow-2xs group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-[#F4EADB] dark:bg-[#2C2419] flex items-center justify-center font-serif font-bold text-xs text-[#C59341] dark:text-[#E8C581] flex-shrink-0">
                      {item.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-semibold text-xs text-[#8A7E6C] dark:text-[#9B8F7D]">
                          {item.chapterTitle}
                        </span>
                      </div>
                      <p className="font-serif font-medium text-xs text-[#2A241E] dark:text-[#FAF7F2] truncate mt-0.5">
                        {item.snippet}
                      </p>
                      <p className="text-[11px] text-[#5A4E3D] dark:text-[#D5C7B5] line-clamp-1 mt-0.5">
                        {item.meaning}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B0A595] group-hover:translate-x-0.5 group-hover:text-[#C59341] transition-all flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          )}

          {/* 5. No Results Found State */}
          {query.trim() && !directVerseMatch && chapterResults.length === 0 && shlokaResults.length === 0 && (
            <div className="text-center py-16 px-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#EFE7D8] dark:bg-[#241D17] flex items-center justify-center mx-auto text-[#8A7E6C]">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2A241E] dark:text-[#FAF7F2]">
                No Results Found
              </h3>
              <p className="text-xs text-[#8A7E6C] dark:text-[#9B8F7D] max-w-xs mx-auto leading-relaxed">
                We couldn't find matches for "<span className="font-semibold text-[#2A241E] dark:text-[#FAF7F2]">{query}</span>".
                <br />
                Try searching <span className="font-bold text-[#C59341]">2.47</span>, <span className="font-bold text-[#C59341]">Karma</span>, <span className="font-bold text-[#C59341]">Peace</span>, or a chapter number like <span className="font-bold text-[#C59341]">2</span>.
              </p>
            </div>
          )}
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

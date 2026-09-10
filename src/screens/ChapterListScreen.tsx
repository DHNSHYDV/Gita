import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { SearchOverlay } from '../components/SearchOverlay';

const hasAnimatedChapters = { current: false };

export const ChapterListScreen: React.FC = () => {
  const { language, goBack, navigateToShloka, t } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isInitial = !hasAnimatedChapters.current;
  if (!hasAnimatedChapters.current) {
    hasAnimatedChapters.current = true;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: isInitial ? 0.028 : 0,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: isInitial ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-28 transition-colors">
      {/* Header - Brought 1 cm below top to keep blank safe region */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))] pb-3 flex items-center justify-between border-b border-[#EAE2D5] dark:border-[#28221B]">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors active:scale-95"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6 text-[#2A241E] dark:text-[#FAF7F2]" strokeWidth={1.75} />
          </button>
          <h1 className="font-serif font-bold text-lg md:text-xl text-[#2A241E] dark:text-[#FAF7F2]">
            {t.chaptersTitle}
          </h1>
        </div>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-full text-[#6E6353] dark:text-[#B0A595] hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </header>

      {/* Comprehensive Search Overlay for Chapters, Shlokas & Topics */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Chapters 1 to 18 Staggered List */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-4 py-3 space-y-2.5"
      >
        {CHAPTERS_DATA.map((chapter) => (
          <motion.div
            key={chapter.id}
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateToShloka(chapter.number, 1)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#EAE2D5] dark:border-[#2D261E] hover:border-[#C59341]/60 dark:hover:border-[#C59341]/60 active:bg-[#F3E7D3] dark:active:bg-[#292218] cursor-pointer shadow-xs hover:shadow transition-all group"
          >
            <div className="flex items-center gap-3.5">
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#EDE4D5] dark:bg-[#2A2319] text-[#3E3324] dark:text-[#E8C581] font-serif font-bold text-base flex items-center justify-center flex-shrink-0">
                {chapter.number}
              </div>

              {/* Chapter Name & Verses Count */}
              <div>
                <h3 className="font-semibold text-sm md:text-base text-[#2A241E] dark:text-[#FAF7F2] group-hover:text-[#966C28] dark:group-hover:text-[#E8C581] transition-colors">
                  {chapter.title[language]}
                </h3>
                <p className="text-xs text-[#8A7E6C] dark:text-[#9B8F7D] mt-0.5">
                  {chapter.versesCount} {t.shlokasCountLabel}
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 group-hover:text-[#966C28] dark:group-hover:text-[#E8C581] transition-all" strokeWidth={1.75} />
          </motion.div>
        ))}
      </motion.main>
    </div>
  );
};

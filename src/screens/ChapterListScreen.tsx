import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';

export const ChapterListScreen: React.FC = () => {
  const { language, goBack, navigateToShloka, t } = useApp();

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <button
          onClick={goBack}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 text-[#2A241E] dark:text-[#FAF7F2]" />
        </button>
        <h1 className="font-semibold text-lg md:text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          {t.chaptersTitle}
        </h1>
      </header>

      {/* Chapters 1 to 18 List */}
      <main className="px-4 py-3 space-y-2.5">
        {CHAPTERS_DATA.map((chapter) => (
          <div
            key={chapter.id}
            onClick={() => navigateToShloka(chapter.number, 1)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#EAE2D5] dark:border-[#2D261E] hover:border-[#C59341]/60 dark:hover:border-[#C59341]/60 cursor-pointer shadow-sm hover:shadow transition-all group"
          >
            <div className="flex items-center gap-3.5">
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-xl bg-[#EDE4D5] dark:bg-[#2A2319] text-[#3E3324] dark:text-[#E8C581] font-bold text-base flex items-center justify-center flex-shrink-0">
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

            <ChevronRight className="w-5 h-5 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 group-hover:text-[#966C28] dark:group-hover:text-[#E8C581] transition-all" />
          </div>
        ))}
      </main>
    </div>
  );
};

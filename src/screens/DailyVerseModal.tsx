import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getVerse } from '../data/verses';
import { ShareStatusModal } from '../components/ShareStatusModal';

// Curated 14 Landmark Morning Wisdom Verses (Synchronized globally)
const MORNING_WISDOM_VERSES = [
  { chapter: 2, verse: 47 },
  { chapter: 4, verse: 7 },
  { chapter: 6, verse: 5 },
  { chapter: 9, verse: 22 },
  { chapter: 12, verse: 13 },
  { chapter: 18, verse: 66 },
  { chapter: 2, verse: 14 },
  { chapter: 2, verse: 20 },
  { chapter: 3, verse: 19 },
  { chapter: 6, verse: 6 },
  { chapter: 7, verse: 7 },
  { chapter: 10, verse: 8 },
  { chapter: 15, verse: 15 },
  { chapter: 18, verse: 78 },
];

export const DailyVerseModal: React.FC = () => {
  const {
    language,
    dailyVerseModalOpen,
    setDailyVerseModalOpen,
    navigateToShloka,
    t,
  } = useApp();

  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!dailyVerseModalOpen) return null;

  // Calculate today's rotating wisdom shloka (synchronized with morning notification)
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const currentDayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const currentRef = MORNING_WISDOM_VERSES[currentDayOfYear % MORNING_WISDOM_VERSES.length];

  const verseData = getVerse(currentRef.chapter, currentRef.verse);
  const translationData = verseData.translations[language] || verseData.translations.en;

  const handleReadInContext = () => {
    setDailyVerseModalOpen(false);
    navigateToShloka(currentRef.chapter, currentRef.verse, false);
  };

  const titles: Record<string, string> = {
    te: "ఉదయకాల శ్లోకం",
    hi: "आज का श्लोक",
    ta: "இன்றைய சுலோகம்",
    kn: "ಇಂದಿನ ಶ್ಲೋಕ",
    en: "Today's Verse",
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 w-full h-full overflow-hidden flex flex-col justify-between select-none"
      >
        {/* High-Resolution Full-Bleed Krishna Artwork Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/krishna_flute_bg.jpg"
            alt="Lord Krishna playing flute in golden clouds"
            className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02]"
          />
          {/* Soft atmospheric gradient blend over clouds for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent 40% via-[#F5D89F]/30 65% to-[#EBC67F]/85 z-10 pointer-events-none" />
        </div>

        {/* Top Header with Close Button */}
        <div className="relative z-20 w-full px-5 pt-[max(3rem,env(safe-area-inset-top,3rem))] flex items-center justify-between">
          <div className="w-8 h-8" />

          {/* Top-Right X Close Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDailyVerseModalOpen(false)}
            className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/35 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </motion.button>
        </div>

        {/* Middle & Bottom Content Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative z-20 w-full px-6 pb-12 flex flex-col items-center text-center mt-auto"
        >
          {/* "Today's Verse" badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md mb-3 border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-[#342413]" />
            <p className="font-serif text-xs font-semibold tracking-wide text-[#342413]">
              {titles[language] || titles.en}
            </p>
          </div>

          {/* Sanskrit Text snippet */}
          <p className="font-serif font-bold text-base md:text-lg text-[#2A1D10] max-w-[320px] drop-shadow-xs mb-2">
            {translationData.scriptShloka || verseData.sanskrit}
          </p>

          {/* The Translation */}
          <h2 className="font-serif font-medium text-xs md:text-sm text-[#4A351E] leading-relaxed max-w-[310px] line-clamp-3 italic">
            "{translationData.translation}"
          </h2>

          {/* Reference: – భగవద్గీత X.Y */}
          <p className="font-serif text-xs font-bold text-[#6D4C2B] mt-2 tracking-wide uppercase">
            – Bhagavad Gita {currentRef.chapter}.{currentRef.verse}
          </p>

          {/* "Read in Context →" Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleReadInContext}
            className="w-full max-w-[270px] mt-5 py-3.5 px-6 rounded-full bg-[#342415] hover:bg-[#25190D] text-[#FAF3E8] font-semibold text-sm shadow-xl shadow-[#342415]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t.readInContext}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>

          {/* Share to Status Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShareModalOpen(true)}
            className="mt-2.5 py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#342415] hover:text-black transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Share to WhatsApp Status / Story</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Sacred WhatsApp Status & Story Card Modal */}
      <ShareStatusModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        data={{
          chapter: currentRef.chapter,
          verse: currentRef.verse,
          sanskrit: verseData.sanskrit,
          regionalScriptShloka: translationData.scriptShloka,
          transliteration: verseData.transliteration,
          bhavartham: translationData.translation,
          language,
        }}
      />
    </>
  );
};

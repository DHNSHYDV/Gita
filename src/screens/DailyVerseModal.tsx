import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyVerseModal: React.FC = () => {
  const {
    language,
    dailyVerseModalOpen,
    setDailyVerseModalOpen,
    navigateToShloka,
    t,
  } = useApp();

  if (!dailyVerseModalOpen) return null;

  const handleReadInContext = () => {
    setDailyVerseModalOpen(false);
    navigateToShloka(6, 5);
  };

  const handleShare = async () => {
    const quoteText =
      language === 'te'
        ? "మన: శాంతి, సమతా భావమే నిజమైన సంపద. – భగవద్గీత 6.5"
        : language === 'hi'
        ? "मन की शांति और समता का भाव ही सच्ची संपदा है। – भगवद्गीता 6.5"
        : language === 'ta'
        ? "மன அமைதியும் சமநோக்குமே உண்மையான செல்வம். – பகவத்கீதை 6.5"
        : language === 'kn'
        ? "ಮನಸ್ಸಿನ ಶಾಂತಿ ಮತ್ತು ಸಮತೆಯೇ ನಿಜವಾದ ಸಂಪತ್ತು. – ಭಗವದ್ಗೀತೆ 6.5"
        : "Peace of mind and equanimity are the greatest wealth. – Bhagavad Gita 6.5";

    const fullShare = `🕉️ Daily Wisdom | Shreemad Bhagavad Gita\n\n"${quoteText}"\n\nShared via Gita App`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Gita Wisdom", text: fullShare });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(fullShare);
      alert('Daily Verse copied to clipboard!');
    }
  };

  // Localized quote text matching Screen 7
  const getDailyVerseText = () => {
    switch (language) {
      case 'te':
        return {
          title: "Today's Verse",
          line1: "మన: శాంతి, సమతా భావమే",
          line2: "నిజమైన సంపద.",
          ref: "– భగవద్గీత 6.5",
        };
      case 'hi':
        return {
          title: "आज का श्लोक",
          line1: "मन की शांति और समता का भाव",
          line2: "ही सच्ची संपदा है।",
          ref: "– भगवद्गीता 6.5",
        };
      case 'ta':
        return {
          title: "இன்றைய சுலோகம்",
          line1: "மன அமைதியும் சமநோக்குமே",
          line2: "உண்மையான செல்வம்.",
          ref: "– பகவத்கீதை 6.5",
        };
      case 'kn':
        return {
          title: "ಇಂದಿನ ಶ್ಲೋಕ",
          line1: "ಮನಸ್ಸಿನ ಶಾಂತಿ ಮತ್ತು ಸಮತೆಯೇ",
          line2: "ನಿಜವಾದ ಸಂಪತ್ತು.",
          ref: "– ಭಗವದ್ಗೀತೆ 6.5",
        };
      case 'en':
      default:
        return {
          title: "Today's Verse",
          line1: "Peace of mind and equanimity",
          line2: "are the true wealth.",
          ref: "– Bhagavad Gita 6.5",
        };
    }
  };

  const verseInfo = getDailyVerseText();

  return (
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
        {/* Soft atmospheric gradient blend over clouds for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent 40% via-[#F5D89F]/30 65% to-[#EBC67F]/85 z-10 pointer-events-none" />
      </div>

      {/* Top Header with Close Button - Brought 1 cm below top */}
      <div className="relative z-20 w-full px-5 pt-[max(3rem,env(safe-area-inset-top,3rem))] flex items-center justify-between">
        <div className="w-8 h-8" />

        {/* Top-Right X Close Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDailyVerseModalOpen(false)}
          className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/35 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </motion.button>
      </div>

      {/* Middle & Bottom Content Area Over the Golden Clouds */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative z-20 w-full px-6 pb-12 flex flex-col items-center text-center mt-auto"
      >
        {/* "Today's Verse" label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md mb-3 border border-white/30">
          <Sparkles className="w-3.5 h-3.5 text-[#342413]" />
          <p className="font-serif text-xs font-semibold tracking-wide text-[#342413]">
            {verseInfo.title}
          </p>
        </div>

        {/* The Quote Lines */}
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1E1308] leading-snug max-w-[300px] drop-shadow-xs">
          {verseInfo.line1}
          <br />
          {verseInfo.line2}
        </h2>

        {/* Reference: – భగవద్గీత 6.5 */}
        <p className="font-serif text-xs md:text-sm font-medium text-[#4D371F] mt-2.5 tracking-wide">
          {verseInfo.ref}
        </p>

        {/* "Read in Context →" Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleReadInContext}
          className="w-full max-w-[270px] mt-6 py-3.5 px-6 rounded-full bg-[#342415] hover:bg-[#25190D] text-[#FAF3E8] font-semibold text-sm shadow-xl shadow-[#342415]/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>{t.readInContext}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </motion.button>

        {/* Share Button with Icon */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="mt-3 py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#342415] hover:text-black transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>{t.share}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

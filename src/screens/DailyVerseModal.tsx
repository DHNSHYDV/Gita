import React from 'react';
import { X, ArrowRight, Share2 } from 'lucide-react';
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

    const fullShare = `🕉️ Today's Verse | Shreemad Bhagavad Gita\n\n"${quoteText}"\n\nShared via Gita App`;
    
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
          line1: "मन की शांति और సమता",
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
    <div className="absolute inset-0 z-50 w-full h-full overflow-hidden flex flex-col justify-between animate-fadeIn select-none">
      {/* High-Resolution Full-Bleed Krishna Artwork Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/krishna_flute_bg.jpg"
          alt="Lord Krishna playing flute in golden clouds"
          className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02]"
        />
        {/* Soft atmospheric gradient blend over clouds for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent 40% via-[#F5D89F]/30 65% to-[#EBC67F]/80 z-10 pointer-events-none"></div>
      </div>

      {/* Top Header with Close Button */}
      <div className="relative z-20 w-full px-5 pt-3 flex items-center justify-between">
        {/* Empty left spacer */}
        <div className="w-8 h-8"></div>

        {/* Top-Right X Close Button */}
        <button
          onClick={() => setDailyVerseModalOpen(false)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A1E12] hover:text-black transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Middle & Bottom Content Area Over the Golden Clouds */}
      <div className="relative z-20 w-full px-6 pb-10 flex flex-col items-center text-center mt-auto">
        {/* "Today's Verse" label */}
        <p className="font-serif text-sm font-semibold tracking-wide text-[#342413] mb-3 drop-shadow-2xs">
          {verseInfo.title}
        </p>

        {/* The Quote Lines */}
        <h2 className="font-serif font-bold text-xl md:text-2xl text-[#1E1308] leading-tight max-w-[280px] drop-shadow-xs">
          {verseInfo.line1}
          <br />
          {verseInfo.line2}
        </h2>

        {/* Reference: – భగవద్గీత 6.5 */}
        <p className="font-serif text-xs md:text-sm font-medium text-[#4D371F] mt-2.5 tracking-wide">
          {verseInfo.ref}
        </p>

        {/* "Read in Context →" Button */}
        <button
          onClick={handleReadInContext}
          className="w-full max-w-[270px] mt-6 py-3.5 px-6 rounded-full bg-[#342415] hover:bg-[#25190D] active:scale-95 text-[#FAF3E8] font-semibold text-sm shadow-xl shadow-[#342415]/30 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <span>{t.readInContext}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Share Button with Icon */}
        <button
          onClick={handleShare}
          className="mt-3 py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#342415] hover:text-black transition-colors active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>{t.share}</span>
        </button>
      </div>
    </div>
  );
};

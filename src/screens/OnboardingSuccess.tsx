import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingSuccess: React.FC = () => {
  const { userName, setOnboardingCompleted, setCurrentScreen } = useApp();

  const handleFinish = () => {
    setOnboardingCompleted(true);
    setCurrentScreen('home');
  };

  return (
    <div className="relative min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] flex flex-col justify-between p-6 select-none overflow-hidden transition-colors">
      {/* Background artwork softly blended */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-25">
        <img
          src="/chariot_welcome_bg.jpg"
          alt="Kurukshetra chariot background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F1EA] via-transparent to-[#F6F1EA] dark:from-[#141210] dark:via-transparent dark:to-[#141210]" />
      </div>

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 pt-[max(3rem,env(safe-area-inset-top,3rem))] text-center"
      >
        {/* Sacred Golden Lotus Reveal */}
        <div className="relative flex justify-center mb-3 text-[#C59341]">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#C59341] filter blur-xl"
            />
            <svg className="w-14 h-14 relative z-10 drop-shadow-sm" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M50 20 C45 35 35 50 20 65 C40 68 50 55 50 45 C50 55 60 68 80 65 C65 50 55 35 50 20 Z" />
              <path d="M50 45 C42 60 25 75 10 75 C30 82 48 70 50 58 C52 70 70 82 90 75 C75 75 58 60 50 45 Z" />
              <path d="M35 75 C45 85 55 85 65 75" />
            </svg>
          </motion.div>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A2319] dark:text-[#FAF7F2] tracking-tight leading-snug">
          Welcome to Gita,
          <br />
          <span className="text-[#C59341] dark:text-[#E8C581]">{userName || 'Seeker'}!</span>
        </h1>

        <p className="mt-2 text-xs md:text-sm text-[#7E7363] dark:text-[#A89D8C] max-w-xs mx-auto leading-relaxed">
          A sacred journey of timeless wisdom, peace and personal transformation begins now.
        </p>
      </motion.div>

      {/* Center Shloka Card with Sacred Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="relative z-10 my-auto py-4 flex justify-center"
      >
        <div className="w-full max-w-xs rounded-2xl p-6 bg-[#FAF6F0]/95 dark:bg-[#1E1914]/95 border-2 border-[#C59341]/40 dark:border-[#C59341]/30 shadow-lg text-center backdrop-blur-xs relative overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#FAF0DE] dark:bg-[#332717] mx-auto mb-3 flex items-center justify-center text-[#C59341]">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="font-serif font-bold text-base md:text-lg text-[#2A2319] dark:text-[#FAF7F2] whitespace-pre-line leading-relaxed">
            यदा यदा हि धर्मस्य
            <br />
            ग्लानिर्भवति भारत ।
          </p>
          <p className="mt-3 text-xs text-[#8C7A64] dark:text-[#B5A48D] font-medium tracking-wide font-serif">
            – Bhagavad Gita 4.7
          </p>
        </div>
      </motion.div>

      {/* Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="relative z-10 pb-6 flex justify-center"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleFinish}
          className="w-full max-w-xs py-3.5 px-6 rounded-full bg-[#362719] hover:bg-[#271C11] text-[#FAF4EA] font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-colors"
        >
          <span>Begin Your Sadhana</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </motion.button>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen, onboardingCompleted, t } = useApp();

  const handleBegin = () => {
    if (onboardingCompleted) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('onboarding-language');
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between items-center select-none">
      {/* High-Resolution Full-Bleed Chariot Battlefield Artwork */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/chariot_welcome_bg.jpg"
          alt="Lord Krishna and Arjuna on chariot at Kurukshetra"
          className="w-full h-full object-cover object-center filter brightness-[1.01] contrast-[1.02]"
        />
        {/* Subtle top and bottom gradients for perfect typography readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5E7D0]/30 via-transparent 30% via-transparent 70% to-[#1A120B]/65 pointer-events-none" />
      </div>

      {/* Top Header: Gita Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full pt-[max(4rem,env(safe-area-inset-top,4rem))] px-6 flex flex-col items-center text-center"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src="/logo.png"
          alt="Gita Sacred Emblem"
          className="w-16 h-16 rounded-2xl shadow-xl shadow-black/25 mb-3 border border-[#E8D4B4]/60"
        />
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#22180F] drop-shadow-xs">
          Gita
        </h1>
        <p className="mt-2 text-sm md:text-base font-medium text-[#382819] leading-snug drop-shadow-2xs">
          Timeless Wisdom
          <br />
          for a Better You
        </p>
      </motion.div>

      {/* Spacer to let the divine scene of Krishna & Arjuna breathe */}
      <div className="flex-1" />

      {/* Bottom Section: Begin the Journey Button & Motto */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-[290px] px-4 pb-12 flex flex-col items-center"
      >
        {/* "Begin the Journey →" Pill Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleBegin}
          className="w-full py-3.5 px-6 rounded-full bg-[#F5E6CC] hover:bg-[#EEDBBF] text-[#2A1D11] font-semibold text-sm md:text-base shadow-xl shadow-black/30 flex items-center justify-center gap-2 transition-colors"
        >
          <span>{t.beginJourney}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </motion.button>

        {/* Sacred Sanskrit Motto */}
        <p className="mt-5 text-xs md:text-sm font-serif font-medium tracking-widest text-[#E8DAC2] drop-shadow-md">
          {t.motto}
        </p>
      </motion.div>
    </div>
  );
};

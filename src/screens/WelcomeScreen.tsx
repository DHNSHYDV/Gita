import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DURATIONS, EASING } from '../utils/motion';

export const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen, onboardingCompleted, t } = useApp();
  const [isBeginning, setIsBeginning] = useState(false);

  const handleBegin = () => {
    if (isBeginning) return;
    setIsBeginning(true);

    // Subtle warm golden ripple then smooth forward progression
    setTimeout(() => {
      if (onboardingCompleted) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding-language');
      }
    }, 280);
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between items-center select-none bg-[#1A120B]">
      {/* High-Resolution Battlefield Chariot Artwork: Soft Cinematic Focus-In */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          initial={{ opacity: 0.25, filter: 'blur(12px) brightness(0.85)', scale: 1.04 }}
          animate={{ opacity: 1, filter: 'blur(0px) brightness(1.01)', scale: 1 }}
          transition={{ duration: 1.2, ease: EASING.emphasized }}
          src="/chariot_welcome_bg.jpg"
          alt="Lord Krishna and Arjuna on chariot at Kurukshetra"
          className="w-full h-full object-cover object-center contrast-[1.02]"
        />
        {/* Subtle top and bottom gradients for perfect typography readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5E7D0]/30 via-transparent 30% via-transparent 70% to-[#1A120B]/70 pointer-events-none" />
      </div>

      {/* Top Header: Gita Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATIONS.slow, ease: EASING.emphasized }}
        className="relative z-10 w-full pt-[max(4rem,env(safe-area-inset-top,4rem))] px-6 flex flex-col items-center text-center"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src="/logo.png"
          alt="Gita Sacred Emblem"
          className="w-16 h-16 rounded-2xl shadow-xl shadow-black/25 mb-3 border border-[#E8D4B4]/60 object-cover"
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
        transition={{ duration: DURATIONS.slow, delay: 0.12, ease: EASING.emphasized }}
        className="relative z-10 w-full max-w-[290px] px-4 pb-12 flex flex-col items-center"
      >
        {/* "Begin the Journey →" Pill Button with Tactile Ripple Feedback */}
        <div className="relative w-full">
          {/* Subtle Warm Golden Expansion Ripple */}
          {isBeginning && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F3CF88] via-[#E5B55E] to-[#F3CF88] blur-sm pointer-events-none"
            />
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            animate={isBeginning ? { scale: [1, 0.97, 1] } : {}}
            disabled={isBeginning}
            onClick={handleBegin}
            className="relative w-full py-3.5 px-6 rounded-full bg-[#F5E6CC] hover:bg-[#EEDBBF] active:bg-[#E2CEB0] text-[#2A1D11] font-semibold text-sm md:text-base shadow-xl shadow-black/35 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t.beginJourney}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>

        {/* Sacred Sanskrit Motto */}
        <p className="mt-5 text-xs md:text-sm font-serif font-medium tracking-widest text-[#E8DAC2] drop-shadow-md">
          {t.motto}
        </p>
      </motion.div>
    </div>
  );
};

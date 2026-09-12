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
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between items-center select-none bg-[#FCF3DC] dark:bg-[#141210]">
      {/* 1. Full-Bleed Sacred Splash Artwork */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img
          initial={{ opacity: 0.9, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASING.emphasized }}
          src="/splash_artwork.png"
          alt="Gita - Timeless Wisdom for a Better You"
          className="w-full h-full object-cover object-center"
        />

        {/* 2. Living Ambient Moving Light Drift */}
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [-12, 12, -12],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#EBD8BA]/35 via-[#F3E5CF]/20 to-transparent blur-3xl pointer-events-none"
        />

        {/* 3. Subtle Pulsing Golden Halo behind the Lotus Emblem */}
        <motion.div
          animate={{
            scale: [0.95, 1.12, 0.95],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-radial from-[#F5D899]/50 via-[#E5B55E]/15 to-transparent blur-2xl pointer-events-none"
        />
      </div>

      {/* Spacer to preserve breathing space for the Lotus, Gita wordmark, and tagline */}
      <div className="flex-1" />

      {/* Bottom Section: Begin the Journey Button & Sacred Motto */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATIONS.slow, delay: 0.2, ease: EASING.emphasized }}
        className="relative z-10 w-full max-w-[300px] px-4 pb-12 flex flex-col items-center"
      >
        {/* "Begin the Journey →" Pill Button with Tactile Ripple Feedback */}
        <div className="relative w-full">
          {/* Warm Golden Expansion Ripple */}
          {isBeginning && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.85 }}
              animate={{ scale: 1.65, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F3CF88] via-[#E5B55E] to-[#F3CF88] blur-sm pointer-events-none"
            />
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            animate={isBeginning ? { scale: [1, 0.97, 1] } : {}}
            disabled={isBeginning}
            onClick={handleBegin}
            className="relative w-full py-3.5 px-6 rounded-full bg-[#231A10] hover:bg-[#1B130B] active:bg-[#120C07] text-[#FAF2E3] font-semibold text-sm md:text-base border border-[#C59B4B]/35 shadow-xl shadow-[#231A10]/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
          >
            <span className="tracking-wide">{t.beginJourney}</span>
            <ArrowRight className="w-4 h-4 text-[#D8B467] stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Sacred Sanskrit Motto */}
        <p className="mt-5 text-xs md:text-sm font-serif font-medium tracking-widest text-[#5C4830] dark:text-[#CBBCA4] drop-shadow-2xs text-center">
          {t.motto}
        </p>
      </motion.div>
    </div>
  );
};

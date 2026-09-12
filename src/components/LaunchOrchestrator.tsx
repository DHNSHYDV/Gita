import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DURATIONS, EASING } from '../utils/motion';

interface LaunchOrchestratorProps {
  children: React.ReactNode;
}

type LaunchPhase = 'stillness' | 'blooming' | 'morphing' | 'complete';

export const LaunchOrchestrator: React.FC<LaunchOrchestratorProps> = ({ children }) => {
  const { onboardingCompleted, currentScreen } = useApp();
  const shouldReduceMotion = useReducedMotion();

  // Determine if this launch is for a returning user
  const isReturningUser = onboardingCompleted;

  const [phase, setPhase] = useState<LaunchPhase>('stillness');
  const [isOverlayMounted, setIsOverlayMounted] = useState<boolean>(true);

  useEffect(() => {
    if (shouldReduceMotion || !isReturningUser || currentScreen === 'welcome') {
      // Immediate reveal for first-time welcome journey or reduced motion
      setPhase('complete');
      setIsOverlayMounted(false);
      return;
    }

    // Fast, serene wake-up for returning users (~550ms total)
    const t1 = setTimeout(() => setPhase('blooming'), 40);
    const t2 = setTimeout(() => setPhase('morphing'), 320);
    const t3 = setTimeout(() => {
      setPhase('complete');
      setIsOverlayMounted(false);
    }, 720);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isReturningUser, currentScreen, shouldReduceMotion]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#FCF3DC] dark:bg-[#141210] overflow-hidden">
      {/* 
        The actual application content is MOUNTED from Frame 0.
        It is visually revealed underneath as the golden aura expands.
        Zero unmounts, zero blank frames, zero layout jumps.
      */}
      <div
        className={`w-full h-full min-h-screen transition-opacity duration-500 ease-out ${
          phase === 'morphing' || phase === 'complete' || !isReturningUser || currentScreen === 'welcome'
            ? 'opacity-100'
            : 'opacity-0'
        }`}
      >
        {children}
      </div>

      {/* Cinematic Splash & Morphing Veil Overlay for Returning Users */}
      <AnimatePresence>
        {isOverlayMounted && isReturningUser && currentScreen !== 'welcome' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: phase === 'morphing' ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: EASING.emphasized,
            }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-[#FCF3DC] dark:bg-[#141210] select-none overflow-hidden"
          >
            {/* The Splash Artwork Image */}
            <motion.img
              src="/splash_artwork.png"
              alt="Gita Splash"
              initial={{ scale: 1.01, opacity: 0.92 }}
              animate={{
                scale: phase === 'morphing' ? 1.04 : 1,
                opacity: phase === 'morphing' ? 0 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: EASING.emphasized,
              }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Living Ambient Moving Light Across Background */}
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

            {/* Expanding Central Golden Light Aura over Lotus / Wordmark */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{
                scale: phase === 'blooming' ? 1.3 : phase === 'morphing' ? 3.0 : 0.35,
                opacity: phase === 'blooming' ? 0.75 : 0,
              }}
              transition={{
                duration: 0.55,
                ease: EASING.emphasized,
              }}
              className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-radial from-[#F5D899]/60 via-[#E5B55E]/25 to-transparent blur-2xl pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

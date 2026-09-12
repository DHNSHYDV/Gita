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
    if (shouldReduceMotion) {
      // Immediate reveal for reduced motion accessibility
      setPhase('complete');
      setIsOverlayMounted(false);
      return;
    }

    if (isReturningUser) {
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
    } else {
      // Cinematic contemplative sequence for first-time journey (~1.6s total)
      const t1 = setTimeout(() => setPhase('blooming'), 180);
      const t2 = setTimeout(() => setPhase('morphing'), 1150);
      const t3 = setTimeout(() => {
        setPhase('complete');
        setIsOverlayMounted(false);
      }, 1750);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isReturningUser, shouldReduceMotion]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#F6F1EA] dark:bg-[#141210] overflow-hidden">
      {/* 
        The actual application content is MOUNTED from Frame 0.
        It is visually revealed underneath as the golden aura expands.
        Zero unmounts, zero blank frames, zero layout jumps.
      */}
      <div
        className={`w-full h-full min-h-screen transition-opacity duration-500 ease-out ${
          phase === 'morphing' || phase === 'complete' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>

      {/* Cinematic Splash & Morphing Veil Overlay */}
      <AnimatePresence>
        {isOverlayMounted && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{
              opacity: phase === 'morphing' ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: isReturningUser ? 0.4 : 0.55,
              ease: EASING.emphasized,
            }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-[#F6F1EA] dark:bg-[#141210] select-none overflow-hidden"
          >
            {/* 1. Subtle Ambient Moving Light Across Background */}
            <motion.div
              animate={{
                x: [-30, 30, -30],
                y: [-20, 20, -20],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#EBD8BA]/30 via-[#F3E5CF]/20 to-transparent dark:from-[#261E14]/40 dark:via-[#1D1711]/25 dark:to-transparent blur-3xl"
            />

            {/* 2. Barely Visible Peacock Feather Texture Moving Through Background */}
            <motion.div
              initial={{ opacity: 0, x: -10, y: 15 }}
              animate={{
                opacity: phase !== 'stillness' ? 0.045 : 0,
                x: [0, 14, 0],
                y: [0, -10, 0],
                rotate: [-2, 3, -2],
              }}
              transition={{
                opacity: { duration: 1.2, ease: 'easeOut' },
                x: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <img
                src="/peacock.svg"
                alt=""
                className="w-80 h-80 object-contain filter invert dark:invert-0 drop-shadow-2xs"
              />
            </motion.div>

            {/* 3. Expanding Central Golden Light */}
            <motion.div
              initial={{ scale: 0.15, opacity: 0 }}
              animate={{
                scale: phase === 'blooming' ? (isReturningUser ? 1.4 : 1.2) : phase === 'morphing' ? 3.2 : 0.15,
                opacity: phase === 'blooming' ? 0.75 : phase === 'morphing' ? 0 : 0,
              }}
              transition={{
                duration: isReturningUser ? 0.5 : 0.9,
                ease: EASING.emphasized,
              }}
              className="absolute w-72 h-72 rounded-full bg-radial from-[#F3CF88]/50 via-[#E5B55E]/20 to-transparent dark:from-[#D4A750]/40 dark:via-[#A67C2E]/15 dark:to-transparent blur-2xl"
            />

            {/* 4. Centerpiece: Gita Sacred Emblem & Wordmark */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              {/* Logo Emblem */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: phase !== 'stillness' ? 1 : 0,
                  scale: phase === 'morphing' ? 0.9 : 1,
                  y: phase === 'morphing' ? (isReturningUser ? -140 : -80) : 0,
                }}
                transition={{
                  duration: isReturningUser ? 0.38 : 0.65,
                  ease: EASING.emphasized,
                }}
                className="relative flex items-center justify-center"
              >
                {/* Subtle outer halo behind logo */}
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.4, 0.75, 0.4],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#E5B55E]/30 to-[#FFDF9E]/45 dark:from-[#C59341]/25 dark:to-[#E8C581]/30 blur-md"
                />

                <img
                  src="/logo.png"
                  alt="Gita Sacred Emblem"
                  className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl shadow-xl shadow-black/15 dark:shadow-black/40 border border-[#E8D4B4]/60 dark:border-[#423422] object-cover"
                />
              </motion.div>

              {/* "Gita" Wordmark */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: phase !== 'stillness' ? 1 : 0,
                  y: phase === 'morphing' ? (isReturningUser ? -135 : -75) : 0,
                }}
                transition={{
                  duration: isReturningUser ? 0.35 : 0.6,
                  delay: isReturningUser ? 0.08 : 0.28,
                  ease: EASING.emphasized,
                }}
                className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#22180F] dark:text-[#F3E7D3] mt-4 drop-shadow-xs"
              >
                Gita
              </motion.h1>

              {/* Tagline: Shown during first-time cinematic sequence */}
              {!isReturningUser && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: phase === 'blooming' ? 0.85 : 0,
                    y: phase === 'blooming' ? 0 : 6,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.55,
                    ease: EASING.standard,
                  }}
                  className="mt-2.5 text-xs sm:text-sm font-medium text-[#5E4935] dark:text-[#B5A48B] tracking-wide"
                >
                  Timeless Wisdom for a Better You
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

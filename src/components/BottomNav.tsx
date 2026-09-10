import React from 'react';
import { Home, BookOpen, Flame, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, t } = useApp();

  const tabs: { id: ScreenType; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }> }[] = [
    { id: 'home', label: t.tabHome, icon: Home },
    { id: 'chapters', label: t.tabChapters, icon: BookOpen },
    { id: 'streaks', label: t.tabStreaks || 'Sadhana', icon: Flame },
    { id: 'bookmarks', label: t.tabBookmarks || 'Saved', icon: Bookmark },
    { id: 'more', label: t.tabMore, icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#FAF7F2]/95 dark:bg-[#181512]/95 backdrop-blur-lg border-t border-[#EAE2D5] dark:border-[#2C261F] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] z-30 transition-colors shadow-[0_-4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center relative">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-colors select-none group min-w-[58px]"
            >
              {/* Spring Animated Active Indicator Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-b from-[#F3E7D3]/80 to-[#EFE1CB]/90 dark:from-[#2E251A] dark:to-[#251E15] rounded-2xl -z-10 border border-[#DFCBB0]/60 dark:border-[#4D3E2B]/60 shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}

              {/* Tab Icon with Micro-Scale */}
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  y: isActive ? -1 : 0
                }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-[#8A5A1B] dark:text-[#E8C581]'
                      : 'text-[#827768] dark:text-[#94897B] group-hover:text-[#4F4435] dark:group-hover:text-[#C5B8A5]'
                  }`}
                  strokeWidth={isActive ? 2 : 1.65}
                />
                {tab.id === 'streaks' && isActive && (
                  <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                )}
              </motion.div>

              {/* Tab Label */}
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight transition-colors duration-200 truncate max-w-[64px] ${
                  isActive
                    ? 'text-[#8A5A1B] dark:text-[#E8C581] font-semibold'
                    : 'text-[#827768] dark:text-[#8D8273]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


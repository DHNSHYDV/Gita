import React from 'react';
import { Home, BookOpen, Flame, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, t } = useApp();

  const tabs: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.tabHome, icon: <Home className="w-5 h-5" /> },
    { id: 'chapters', label: t.tabChapters, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'streaks', label: t.tabStreaks || 'Streaks', icon: <Flame className="w-5 h-5" /> },
    { id: 'more', label: t.tabMore, icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#FAF7F2] dark:bg-[#1A1815] border-t border-[#EAE3D6] dark:border-[#2D2820] px-3 py-2 z-30 transition-colors shadow-lg">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#8A5A1B] dark:text-[#E8C581] font-semibold scale-105'
                  : 'text-[#8C8274] dark:text-[#887F72] hover:text-[#5A4F3F]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#F2E5D0] dark:bg-[#2F271B]' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

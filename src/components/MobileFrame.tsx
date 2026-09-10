import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [deviceView, setDeviceView] = useState<boolean>(true);
  const { currentScreen, dailyVerseModalOpen } = useApp();

  const isFullBleed = currentScreen === 'welcome' || dailyVerseModalOpen;

  // Current time formatted for status bar
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-[#E3DDD4] dark:bg-[#0D0B0A] flex flex-col items-center justify-center p-0 md:p-6 transition-colors font-sans">
      {/* Top Floating View Toggle for Desktop/Testing */}
      <div className="hidden md:flex items-center gap-3 mb-4 py-1.5 px-4 rounded-full bg-white/80 dark:bg-[#201B16]/80 backdrop-blur-md border border-[#D5C9B7] dark:border-[#382F24] shadow-sm text-xs text-[#5E5242] dark:text-[#C5B9A8]">
        <span className="font-semibold text-[#8C6D3F] dark:text-[#E8C581]">Gita Mobile Preview</span>
        <span className="text-[#B0A595]">|</span>
        <button
          onClick={() => setDeviceView(!deviceView)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#F0E6D8] dark:hover:bg-[#2D251D] transition-colors"
        >
          {deviceView ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{deviceView ? 'Switch to Full Web View' : 'Switch to Phone View'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceView
            ? 'max-w-[412px] h-[100dvh] md:h-[860px] md:rounded-[44px] md:border-[10px] md:border-[#26211C] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden relative flex flex-col'
            : 'max-w-md min-h-screen relative flex flex-col shadow-xl'
        } bg-[#F6F1EA] dark:bg-[#141210]`}
      >
        {/* Mobile Status Bar (Transparent & overlaying for full-bleed screens) */}
        <div
          className={`w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none z-30 transition-all ${
            isFullBleed
              ? 'absolute top-0 left-0 right-0 bg-transparent text-[#22180F]'
              : 'bg-[#F6F1EA]/95 dark:bg-[#141210]/95 text-[#3E3325] dark:text-[#E5D7C3]'
          }`}
        >
          <span>{currentTime || '9:41'}</span>

          {/* Dynamic Island / Camera notch on phone frame */}
          <div className="hidden md:block w-20 h-4 rounded-full bg-[#1C1814] -mt-1 mx-auto"></div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Screen Content Container with Smooth Scroll */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen, t } = useApp();

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between items-center select-none animate-fadeIn">
      {/* High-Resolution Full-Bleed Chariot Battlefield Artwork */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/chariot_welcome_bg.jpg"
          alt="Lord Krishna and Arjuna on chariot at Kurukshetra"
          className="w-full h-full object-cover object-center filter brightness-[1.01] contrast-[1.02]"
        />
        {/* Subtle top and bottom gradients for perfect typography readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5E7D0]/30 via-transparent 30% via-transparent 70% to-[#1A120B]/60 pointer-events-none"></div>
      </div>

      {/* Top Header: Gita Title & Subtitle */}
      <div className="relative z-10 w-full pt-12 md:pt-14 px-6 text-center">
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#22180F] drop-shadow-xs">
          Gita
        </h1>
        <p className="mt-2 text-sm md:text-base font-medium text-[#382819] leading-snug drop-shadow-2xs">
          Timeless Wisdom
          <br />
          for a Better You
        </p>
      </div>

      {/* Spacer to let the divine scene of Krishna & Arjuna breathe */}
      <div className="flex-1"></div>

      {/* Bottom Section: Begin the Journey Button & Motto */}
      <div className="relative z-10 w-full max-w-[290px] px-4 pb-12 flex flex-col items-center">
        {/* "Begin the Journey →" Pill Button */}
        <button
          onClick={() => setCurrentScreen('home')}
          className="w-full py-3.5 px-6 rounded-full bg-[#F5E6CC] hover:bg-[#EEDBBF] active:scale-95 text-[#2A1D11] font-semibold text-sm md:text-base shadow-xl shadow-black/30 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <span>{t.beginJourney}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Sacred Sanskrit Motto */}
        <p className="mt-5 text-xs md:text-sm font-serif font-medium tracking-widest text-[#E8DAC2] drop-shadow-md">
          {t.motto}
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingUsername: React.FC = () => {
  const { userName, setUserName, setCurrentScreen } = useApp();
  const [inputValue, setInputValue] = useState(userName || 'Dhanush');

  const handleContinue = () => {
    const trimmed = inputValue.trim() || 'Dhanush';
    setUserName(trimmed);
    setCurrentScreen('onboarding-auth');
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] flex flex-col justify-between p-6 select-none transition-colors">
      {/* Top Header */}
      <div>
        <div className="pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))]">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setCurrentScreen('onboarding-language')}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.75] text-[#2A241E] dark:text-[#FAF7F2]" />
          </motion.button>
        </div>

        {/* Sacred Lotus Icon */}
        <div className="flex justify-center mt-4 mb-2 text-[#C59341]">
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M50 20 C45 35 35 50 20 65 C40 68 50 55 50 45 C50 55 60 68 80 65 C65 50 55 35 50 20 Z" />
            <path d="M50 45 C42 60 25 75 10 75 C30 82 48 70 50 58 C52 70 70 82 90 75 C75 75 58 60 50 45 Z" />
            <path d="M35 75 C45 85 55 85 65 75" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center px-4">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A2319] dark:text-[#FAF7F2] tracking-tight">
            What should we call you?
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-[#7E7363] dark:text-[#A89D8C]">
            Your name will walk alongside fellow devotees in the Sadhana Circle
          </p>
        </div>

        {/* Input Card with User Icon & Clear Button */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="flex items-center px-4 py-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-xs focus-within:ring-2 focus-within:ring-[#C59341]/60 transition-all">
            <User className="w-5 h-5 stroke-[1.75] text-[#8A7E6C] mr-3" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 bg-transparent text-sm md:text-base font-medium text-[#2A241E] dark:text-[#FAF7F2] focus:outline-none"
              autoFocus
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="p-1 rounded-full text-[#A89D8D] hover:text-[#4A3F30]"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleContinue}
            className="w-full max-w-xs py-3.5 px-6 rounded-full bg-[#362719] hover:bg-[#271C11] text-[#FAF4EA] font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>

      {/* Bottom Artwork: Peacock Feather & Calligraphy Quote */}
      <div className="pb-8 pt-4 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-3">
          <img
            src="/peacock.svg"
            alt="Peacock feather"
            className="w-16 h-16 transform -rotate-12 drop-shadow-sm opacity-90"
          />
          <p className="font-serif italic text-xs md:text-sm text-[#7D705E] dark:text-[#B5A795] max-w-[190px] leading-relaxed">
            "A small step of devotion begins a lifetime of peace."
          </p>
        </div>
      </div>
    </div>
  );
};

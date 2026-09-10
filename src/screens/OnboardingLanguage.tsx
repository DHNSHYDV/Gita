import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const OnboardingLanguage: React.FC = () => {
  const { language, setLanguage, setCurrentScreen } = useApp();

  const languagesList: { code: Language; label: string; script: string }[] = [
    { code: 'te', label: 'Telugu', script: 'తెలుగు' },
    { code: 'en', label: 'English', script: 'English' },
    { code: 'hi', label: 'Hindi', script: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', script: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', script: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] flex flex-col justify-between p-6 select-none transition-colors">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))]">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setCurrentScreen('welcome')}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.75] text-[#2A241E] dark:text-[#FAF7F2]" />
          </motion.button>
          <button
            onClick={() => setCurrentScreen('onboarding-auth')}
            className="text-xs font-semibold text-[#8C6D3F] dark:text-[#E8C581] hover:underline px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Sacred Lotus Icon */}
        <div className="flex justify-center mt-3 mb-2 text-[#C59341]">
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M50 20 C45 35 35 50 20 65 C40 68 50 55 50 45 C50 55 60 68 80 65 C65 50 55 35 50 20 Z" />
            <path d="M50 45 C42 60 25 75 10 75 C30 82 48 70 50 58 C52 70 70 82 90 75 C75 75 58 60 50 45 Z" />
            <path d="M35 75 C45 85 55 85 65 75" />
          </svg>
        </div>

        {/* Heading & Subheading */}
        <div className="text-center px-4">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A2319] dark:text-[#FAF7F2] tracking-tight">
            Choose Your Sacred Tongue
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-[#7E7363] dark:text-[#A89D8C]">
            Experience the verses, meanings and purports in your native script
          </p>
        </div>

        {/* Language Selection Card */}
        <div className="mt-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] divide-y divide-[#EAE2D5]/70 dark:divide-[#28221B] shadow-xs overflow-hidden">
          {languagesList.map((item, idx) => {
            const isSelected = language === item.code;
            return (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setLanguage(item.code)}
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm md:text-base ${isSelected ? 'font-bold text-[#2A241E] dark:text-[#FAF7F2]' : 'text-[#5A4F3F] dark:text-[#B5A896]'}`}>
                    {item.label}
                  </span>
                  <span className="text-xs text-[#8A7E6C] dark:text-[#7A7062]">
                    ({item.script})
                  </span>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-[#C59341] bg-[#C59341]'
                    : 'border-[#B8AB98] dark:border-[#524738]'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Continue Section */}
      <div className="pt-6 pb-4 flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentScreen('onboarding-auth')}
          className="w-full max-w-xs py-3.5 px-6 rounded-full bg-[#362719] hover:bg-[#271C11] text-[#FAF4EA] font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-colors"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </motion.button>

        <p className="mt-4 text-[11px] text-[#8C806F] dark:text-[#8D8274] font-medium tracking-wide">
          The same eternal wisdom. In your language. ॐ
        </p>
      </div>
    </div>
  );
};

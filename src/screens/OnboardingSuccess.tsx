import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingSuccess: React.FC = () => {
  const { userName, setOnboardingCompleted, setCurrentScreen } = useApp();

  const handleFinish = () => {
    setOnboardingCompleted(true);
    setCurrentScreen('home');
  };

  return (
    <div className="relative min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] flex flex-col justify-between p-6 select-none overflow-hidden transition-colors animate-fadeIn">
      {/* Background artwork softly blended */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30">
        <img
          src="/chariot_welcome_bg.jpg"
          alt="Kurukshetra chariot background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F1EA] via-transparent to-[#F6F1EA] dark:from-[#141210] dark:via-transparent dark:to-[#141210]"></div>
      </div>

      {/* Top Header */}
      <div className="relative z-10 pt-6 text-center">
        {/* Sacred Lotus Icon */}
        <div className="flex justify-center mb-2 text-[#C59341]">
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M50 20 C45 35 35 50 20 65 C40 68 50 55 50 45 C50 55 60 68 80 65 C65 50 55 35 50 20 Z" />
            <path d="M50 45 C42 60 25 75 10 75 C30 82 48 70 50 58 C52 70 70 82 90 75 C75 75 58 60 50 45 Z" />
            <path d="M35 75 C45 85 55 85 65 75" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A2319] dark:text-[#FAF7F2] tracking-tight leading-snug">
          Welcome to Gita,
          <br />
          <span className="text-[#966C28] dark:text-[#E8C581]">{userName || 'Seeker'}!</span>
        </h1>

        <p className="mt-2 text-xs md:text-sm text-[#7E7363] dark:text-[#A89D8C] max-w-xs mx-auto leading-relaxed">
          A journey of wisdom, peace and a better you begins now.
        </p>
      </div>

      {/* Center Shloka Card (Screen 5 layout) */}
      <div className="relative z-10 my-auto py-4 flex justify-center">
        <div className="w-full max-w-xs rounded-2xl p-5 bg-[#FAF6F0]/95 dark:bg-[#1E1914]/95 border border-[#E8DDCF] dark:border-[#382F24] shadow-lg text-center backdrop-blur-xs">
          <p className="font-serif font-bold text-base md:text-lg text-[#2A2319] dark:text-[#FAF7F2] whitespace-pre-line leading-relaxed">
            यदा यदा हि धर्मस्य
            <br />
            ग्लानिर्भवति भारत ।
          </p>
          <p className="mt-2.5 text-xs text-[#8C7A64] dark:text-[#B5A48D] font-medium tracking-wide">
            – Bhagavad Gita 4.7
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="relative z-10 pb-6 flex justify-center">
        <button
          onClick={handleFinish}
          className="w-full max-w-xs py-3.5 px-6 rounded-full bg-[#362719] hover:bg-[#271C11] active:scale-95 text-[#FAF4EA] font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-all duration-200"
        >
          <span>Continue to Home</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};

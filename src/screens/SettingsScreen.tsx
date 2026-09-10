import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Sun, Moon, Smartphone, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, TextSize, ThemeMode } from '../types';

export const SettingsScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    textSize,
    setTextSize,
    theme,
    setTheme,
    dailyReminderEnabled,
    setDailyReminderEnabled,
    setCurrentScreen,
    openSettingsFromScreen,
    setOpenSettingsFromScreen,
    t,
  } = useApp();

  const handleBack = () => {
    if (openSettingsFromScreen) {
      setCurrentScreen(openSettingsFromScreen);
      setOpenSettingsFromScreen(null);
    } else {
      setCurrentScreen('more');
    }
  };

  const languagesList: { code: Language; label: string; script: string }[] = [
    { code: 'te', label: 'Telugu', script: 'తెలుగు' },
    { code: 'en', label: 'English', script: 'English' },
    { code: 'hi', label: 'Hindi', script: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', script: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', script: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 select-none transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[1.75] text-[#2A241E] dark:text-[#FAF7F2]" />
        </motion.button>
        <h1 className="font-serif font-bold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          {t.settingsTitle}
        </h1>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-6">
        {/* Section 1: Sacred Language */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9F9484] mb-3 px-1 font-serif">
            {t.languageSection}
          </h2>

          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] divide-y divide-[#EAE2D5]/70 dark:divide-[#28221B] shadow-xs overflow-hidden">
            {languagesList.map((item) => {
              const isSelected = language === item.code;
              return (
                <motion.div
                  key={item.code}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setLanguage(item.code)}
                  className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors"
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

        {/* Section 2: Display & Typography */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9F9484] mb-3 px-1 font-serif">
            {t.displaySection}
          </h2>

          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] p-4 space-y-4 shadow-xs">
            {/* Text Size Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#4A3F30] dark:text-[#C5B9A7]">
                {t.textSize}
              </span>

              <div className="flex items-center gap-1.5 bg-[#EFE7DA] dark:bg-[#2A2319] p-1 rounded-xl border border-[#E2D6C5] dark:border-[#382E22]">
                {(['sm', 'md', 'lg'] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`w-10 h-8 rounded-lg flex items-center justify-center transition-all ${
                      textSize === size
                        ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-bold'
                        : 'text-[#7A6E5D] dark:text-[#9F9382] hover:text-[#2A241E]'
                    }`}
                  >
                    <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm font-semibold' : 'text-base font-bold'}>
                      A
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Live Preview */}
            <div className="p-3 rounded-xl bg-[#F4EDE2] dark:bg-[#241E17] border border-[#E6DBCE] dark:border-[#332A20] text-center">
              <p className={`font-serif italic text-[#4A3D2D] dark:text-[#D5C7B5] ${
                textSize === 'sm' ? 'text-xs' : textSize === 'md' ? 'text-sm' : 'text-base'
              }`}>
                "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
              </p>
              <p className="text-[10px] text-[#8A7E6C] mt-1">
                Live Shloka Preview ({textSize.toUpperCase()})
              </p>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EAE2D5]/70 dark:border-[#28221B]">
              <span className="text-sm font-medium text-[#4A3F30] dark:text-[#C5B9A7]">
                {t.themeLabel}
              </span>

              <div className="flex items-center gap-1 bg-[#EFE7DA] dark:bg-[#2A2319] p-1 rounded-xl border border-[#E2D6C5] dark:border-[#382E22]">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                      : 'text-[#7A6E5D] dark:text-[#9F9382]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{t.lightTheme}</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                      : 'text-[#7A6E5D] dark:text-[#9F9382]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{t.darkTheme}</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === 'system'
                      ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                      : 'text-[#7A6E5D] dark:text-[#9F9382]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{t.systemTheme}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Daily Sadhana Reminder */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A7E6C] dark:text-[#9F9484] mb-3 px-1 font-serif">
            {t.notificationsSection}
          </h2>

          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] p-4 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-sm font-semibold text-[#4A3F30] dark:text-[#C5B9A7] block">
                {t.dailyReminder}
              </span>
              <span className="text-xs text-[#8A7E6C] dark:text-[#8D8274]">
                Receive a daily verse at 07:00 AM
              </span>
            </div>

            {/* Spring Animated Switch */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setDailyReminderEnabled(!dailyReminderEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none p-1 ${
                dailyReminderEnabled ? 'bg-[#C59341]' : 'bg-[#D2C5B3] dark:bg-[#3D3428]'
              }`}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${
                  dailyReminderEnabled ? 'ml-auto' : ''
                }`}
              />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

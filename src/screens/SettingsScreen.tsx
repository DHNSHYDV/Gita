import React from 'react';
import { ChevronLeft, Sun, Moon, Smartphone } from 'lucide-react';
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

  const languagesList: { code: Language; label: string }[] = [
    { code: 'te', label: 'Telugu (తెలుగు)' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 py-4 flex items-center gap-3 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 text-[#2A241E] dark:text-[#FAF7F2]" />
        </button>
        <h1 className="font-semibold text-lg md:text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          {t.settingsTitle}
        </h1>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-6">
        {/* Section 1: Language */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7E7363] dark:text-[#9F9484] mb-3 px-1">
            {t.languageSection}
          </h2>

          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] divide-y divide-[#EAE2D5]/70 dark:divide-[#28221B] shadow-sm overflow-hidden">
            {languagesList.map((item) => {
              const isSelected = language === item.code;
              return (
                <div
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors"
                >
                  <span className={`text-sm md:text-base ${isSelected ? 'font-semibold text-[#2A241E] dark:text-[#FAF7F2]' : 'text-[#5A4F3F] dark:text-[#B5A896]'}`}>
                    {item.label}
                  </span>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#966C28] dark:border-[#E8C581] bg-transparent'
                      : 'border-[#B8AB98] dark:border-[#524738]'
                  }`}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#966C28] dark:bg-[#E8C581]"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Display */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7E7363] dark:text-[#9F9484] mb-3 px-1">
            {t.displaySection}
          </h2>

          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] p-4 space-y-4 shadow-sm">
            {/* Text Size */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#4A3F30] dark:text-[#C5B9A7]">
                {t.textSize}
              </span>

              <div className="flex items-center gap-2 bg-[#EFE7DA] dark:bg-[#2A2319] p-1 rounded-xl">
                {(['sm', 'md', 'lg'] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`w-9 h-8 rounded-lg flex items-center justify-center transition-all ${
                      textSize === size
                        ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-bold'
                        : 'text-[#7A6E5D] dark:text-[#9F9382] hover:text-[#2A241E]'
                    }`}
                  >
                    <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base font-semibold'}>
                      A
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D5]/70 dark:border-[#28221B]">
              <span className="text-sm font-medium text-[#4A3F30] dark:text-[#C5B9A7]">
                {t.themeLabel}
              </span>

              <div className="flex items-center gap-1 bg-[#EFE7DA] dark:bg-[#2A2319] p-1 rounded-xl">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs'
                      : 'text-[#7A6E5D] dark:text-[#9F9382]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>{t.lightTheme}</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs'
                      : 'text-[#7A6E5D] dark:text-[#9F9382]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{t.darkTheme}</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === 'system'
                      ? 'bg-white dark:bg-[#3D3325] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs'
                      : 'text-[#7A6E5D] dark:text-[#9F9382]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{t.systemTheme}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notifications */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7E7363] dark:text-[#9F9484] mb-3 px-1">
            {t.notificationsSection}
          </h2>

          <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] p-4 flex items-center justify-between shadow-sm">
            <span className="text-sm font-medium text-[#4A3F30] dark:text-[#C5B9A7]">
              {t.dailyReminder}
            </span>

            <button
              onClick={() => setDailyReminderEnabled(!dailyReminderEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                dailyReminderEnabled ? 'bg-[#966C28] dark:bg-[#C59341]' : 'bg-[#D2C5B3] dark:bg-[#3D3428]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  dailyReminderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

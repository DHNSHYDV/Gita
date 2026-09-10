import React, { useState } from 'react';
import {
  User,
  Bookmark as BookmarkIcon,
  Clock,
  Bell,
  Globe,
  Palette,
  Info,
  Star,
  Share2,
  ChevronRight,
  Sparkles,
  Sun,
  X,
  Flame,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MoreScreen: React.FC = () => {
  const {
    language,
    theme,
    dailyReminderEnabled,
    setDailyReminderEnabled,
    setCurrentScreen,
    setOpenSettingsFromScreen,
    setDailyVerseModalOpen,
    readingHistory,
    navigateToShloka,
    userName,
    isGoogleLinked,
    t,
  } = useApp();

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  const langNames: Record<string, string> = {
    te: 'Telugu (తెలుగు)',
    en: 'English',
    hi: 'Hindi (हिंदी)',
    ta: 'Tamil (தமிழ்)',
    kn: 'Kannada (ಕನ್ನಡ)',
  };

  const themeNames: Record<string, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  const handleShareApp = async () => {
    const text = `📖 Experience the wisdom of Shreemad Bhagavad Gita with daily verses, audio chanting, and translations in Telugu, Hindi, Tamil, Kannada, and English!\n\nDownload the Gita App on Google Play Store: https://play.google.com/store/apps/details?id=com.gita.wisdom`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Gita Mobile App", text });
      } catch {
        // Cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('App link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-5 pt-6 pb-4 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <h1 className="font-semibold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          {t.moreTitle}
        </h1>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-5">
        {/* User / Devotional Profile Card */}
        <div className="rounded-2xl p-4 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E3D3BE] to-[#F7EBD6] dark:from-[#3D3325] dark:to-[#2A2319] border-2 border-[#C59341]/50 flex items-center justify-center text-[#8C6D3F] dark:text-[#E8C581] flex-shrink-0">
            <User className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#2A241E] dark:text-[#FAF7F2] tracking-tight">
                {userName || t.seekLearnLive}
              </h2>
              {isGoogleLinked && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Google Linked
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A7E6C] dark:text-[#9F9382] mt-0.5">
              {t.closerToBetterYou}
            </p>
          </div>
        </div>

        {/* Action List Items */}
        <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] divide-y divide-[#EAE2D5]/70 dark:divide-[#28221B] shadow-sm overflow-hidden">
          {/* Today's Verse / Daily Verse */}
          <div
            onClick={() => setDailyVerseModalOpen(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-[#966C28] dark:text-[#E8C581] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-[#2A241E] dark:text-[#FAF7F2]">
                {t.todayVerse}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>

          {/* Intro & Onboarding Tour */}
          <div
            onClick={() => setCurrentScreen('welcome')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                Welcome & Onboarding Tour
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>

          {/* Devotee Streaks & Sadhana */}
          <div
            onClick={() => setCurrentScreen('streaks')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Flame className="w-4 h-4 fill-orange-500/20" />
              </div>
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                Devotee Streaks & Sadhana
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                72 Days 🔥
              </span>
              <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
            </div>
          </div>

          {/* My Bookmarks */}
          <div
            onClick={() => setCurrentScreen('bookmarks')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <BookmarkIcon className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.myBookmarks}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>

          {/* Reading History */}
          <div
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.readingHistory}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>

          {/* Daily Reminder */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.dailyReminder}
              </span>
            </div>
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

          {/* Language Selector */}
          <div
            onClick={() => {
              setOpenSettingsFromScreen('more');
              setCurrentScreen('settings');
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.languageOption}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E6C] dark:text-[#9F9382]">
              <span>{langNames[language]}</span>
              <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
            </div>
          </div>

          {/* Appearance */}
          <div
            onClick={() => {
              setOpenSettingsFromScreen('more');
              setCurrentScreen('settings');
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.appearanceOption}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E6C] dark:text-[#9F9382]">
              <span>{themeNames[theme]}</span>
              <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
            </div>
          </div>

          {/* About Gita */}
          <div
            onClick={() => setShowAboutModal(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.aboutGita}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>

          {/* Rate the App */}
          <div
            onClick={() => setShowRateModal(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.rateApp}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>

          {/* Share with Friends */}
          <div
            onClick={handleShareApp}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] group-hover:text-[#966C28]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.shareWithFriends}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455]" />
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm overflow-hidden">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out?')) {
                setCurrentScreen('welcome');
              }
            }}
            className="w-full flex items-center justify-between p-4 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-semibold">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        </div>

        {/* Footer Version Info */}
        <div className="text-center pt-2 pb-4 text-xs text-[#9E9281] dark:text-[#6F6557]">
          <p>Gita v1.2.1 (Build 4)</p>
          <p className="mt-0.5">Designed for Google Play Store</p>
        </div>
      </main>

      {/* About Gita Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#382F24] p-6 text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F2E5D0] dark:bg-[#2C2317] text-[#966C28] dark:text-[#E8C581] mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2A241E] dark:text-[#FAF7F2]">
              Shreemad Bhagavad Gita
            </h3>

            <p className="text-xs text-[#5E5242] dark:text-[#C5B9A8] leading-relaxed">
              The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata. It is a sacred dialogue between Prince Arjuna and Lord Krishna, addressing duty, action, peace, and devotion.
            </p>

            <div className="p-3 rounded-xl bg-[#EFE7DA] dark:bg-[#262019] text-xs font-semibold text-[#8C6B32] dark:text-[#DDB876]">
              18 Chapters • 700 Verses • 5 Languages
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2A241E] dark:bg-[#E8C581] text-white dark:text-[#1F1912] text-xs font-semibold hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reading History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#382F24] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-[#2A241E] dark:text-[#FAF7F2]">
                {t.readingHistory}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {readingHistory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setShowHistoryModal(false);
                    navigateToShloka(item.chapter, item.verse);
                  }}
                  className="p-3 rounded-xl bg-[#EFE8DD] dark:bg-[#262019] flex items-center justify-between cursor-pointer hover:bg-[#E7DDCF] dark:hover:bg-[#312920]"
                >
                  <div>
                    <p className="font-semibold text-xs text-[#2A241E] dark:text-[#FAF7F2]">
                      {t.chapterLabel} {item.chapter}, {t.shlokaLabel} {item.verse}
                    </p>
                    <p className="text-[10px] text-[#8C806F] mt-0.5">{item.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A89D8D]" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2A241E] dark:bg-[#E8C581] text-white dark:text-[#1F1912] text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#382F24] p-6 text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#FFF4DC] dark:bg-[#352B1C] text-[#C59341] mx-auto flex items-center justify-center">
              <Star className="w-6 h-6 fill-current" />
            </div>

            <h3 className="font-serif text-lg font-bold text-[#2A241E] dark:text-[#FAF7F2]">
              Love the Gita App?
            </h3>

            <p className="text-xs text-[#5E5242] dark:text-[#C5B9A8]">
              Your 5-star rating helps spread the timeless wisdom of Lord Krishna to seekers across the world.
            </p>

            <div className="flex justify-center gap-1 text-[#C59341] py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-7 h-7 fill-current cursor-pointer hover:scale-110 transition-transform" />
              ))}
            </div>

            <button
              onClick={() => {
                setShowRateModal(false);
                alert('Thank you for supporting the Gita App! ❤️');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#966C28] to-[#C59341] text-white text-xs font-semibold shadow-md"
            >
              Rate on Google Play Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

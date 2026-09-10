import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronLeft,
  Sparkles,
  Sun,
  X,
  Flame,
  LogOut,
  Heart
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
    goBack,
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
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 select-none transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 py-3 flex items-center gap-2 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={goBack}
          className="p-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors text-[#2A241E] dark:text-[#FAF7F2]"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[1.75]" />
        </motion.button>
        <h1 className="font-serif font-bold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          {t.moreTitle}
        </h1>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-5">
        {/* User / Devotional Profile Card */}
        <div className="rounded-2xl p-4 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] flex items-center gap-4 shadow-xs relative overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E3D3BE] to-[#F7EBD6] dark:from-[#3D3325] dark:to-[#2A2319] border-2 border-[#C59341]/60 flex items-center justify-center text-[#8C6D3F] dark:text-[#E8C581] flex-shrink-0 shadow-xs">
            <User className="w-7 h-7 stroke-[1.75]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-bold text-base text-[#2A241E] dark:text-[#FAF7F2] truncate">
                {userName || t.seekLearnLive}
              </h2>
              {isGoogleLinked && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
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
        <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] divide-y divide-[#EAE2D5]/70 dark:divide-[#28221B] shadow-xs overflow-hidden">
          {/* Today's Verse / Daily Verse */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setDailyVerseModalOpen(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-[#C59341] dark:text-[#E8C581] stroke-[1.75] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-[#2A241E] dark:text-[#FAF7F2]">
                {t.todayVerse}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Intro & Onboarding Tour */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentScreen('welcome')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                Welcome & Onboarding Tour
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Sadhana Circle */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentScreen('streaks')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-[#D97706] dark:text-[#FBBF24]">
                <Flame className="w-4 h-4 fill-amber-500/20 stroke-[1.75]" />
              </div>
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.sadhanaCircle || 'Sadhana Circle'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Active 🔥
              </span>
              <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* My Bookmarks */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentScreen('bookmarks')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <BookmarkIcon className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.myBookmarks}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Reading History */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.readingHistory}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Daily Reminder */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.dailyReminder}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setDailyReminderEnabled(!dailyReminderEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none p-0.5 ${
                dailyReminderEnabled ? 'bg-[#C59341]' : 'bg-[#D2C5B3] dark:bg-[#3D3428]'
              }`}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-xs ${
                  dailyReminderEnabled ? 'ml-auto' : ''
                }`}
              />
            </motion.button>
          </div>

          {/* Language Selector */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setOpenSettingsFromScreen('more');
              setCurrentScreen('settings');
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.languageOption}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E6C] dark:text-[#9F9382]">
              <span>{langNames[language]}</span>
              <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setOpenSettingsFromScreen('more');
              setCurrentScreen('settings');
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.appearanceOption}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E6C] dark:text-[#9F9382]">
              <span>{themeNames[theme]}</span>
              <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* About Gita */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowAboutModal(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.aboutGita}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Rate the App */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowRateModal(true)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.rateApp}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>

          {/* Share with Friends */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={handleShareApp}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F3EBE0] dark:hover:bg-[#25201A] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-[#8A7E6C] dark:text-[#9F9382] stroke-[1.75] group-hover:text-[#C59341]" />
              <span className="text-sm font-medium text-[#2A241E] dark:text-[#FAF7F2]">
                {t.shareWithFriends}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B0A595] dark:text-[#6F6455] group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </div>

        {/* Sign Out Card */}
        <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-xs overflow-hidden">
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              if (window.confirm('Are you sure you want to return to the welcome screen?')) {
                setCurrentScreen('welcome');
              }
            }}
            className="w-full flex items-center justify-between p-4 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 stroke-[1.75] group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-semibold">Switch Account / Restart Tour</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </motion.button>
        </div>

        {/* Footer Version Info */}
        <div className="text-center pt-2 pb-4 text-xs text-[#9E9281] dark:text-[#6F6557]">
          <p className="font-serif">Gita v1.4.0 (Production Release)</p>
          <p className="mt-0.5">Designed with devotion for Google Play Store</p>
        </div>
      </main>

      {/* About Gita Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#382F24] p-6 text-center space-y-4 shadow-2xl"
            >
              <button
                onClick={() => setShowAboutModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#F2E5D0] dark:bg-[#2C2317] text-[#C59341] dark:text-[#E8C581] mx-auto flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 stroke-[1.75]" />
              </div>

              <h3 className="font-serif text-xl font-bold text-[#2A241E] dark:text-[#FAF7F2]">
                Shreemad Bhagavad Gita
              </h3>

              <p className="text-xs text-[#5E5242] dark:text-[#C5B9A8] leading-relaxed">
                The Bhagavad Gita is a 700-verse timeless spiritual scripture that illuminates duty, karma, inner peace, and divine devotion through Krishna's dialogue with Arjuna.
              </p>

              <div className="p-3 rounded-xl bg-[#EFE7DA] dark:bg-[#262019] text-xs font-semibold text-[#8C6B32] dark:text-[#DDB876] border border-[#DECDBD] dark:border-[#3A2F22]">
                18 Chapters • 700 Verses • 5 Languages
              </div>

              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#2A241E] dark:bg-[#E8C581] text-white dark:text-[#1F1912] text-xs font-semibold hover:opacity-95 active:scale-[0.98] transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#382F24] p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#2A241E] dark:text-[#FAF7F2]">
                  {t.readingHistory}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {readingHistory.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowHistoryModal(false);
                      navigateToShloka(item.chapter, item.verse);
                    }}
                    className="p-3 rounded-xl bg-[#EFE8DD] dark:bg-[#262019] flex items-center justify-between cursor-pointer hover:bg-[#E7DDCF] dark:hover:bg-[#312920] border border-[#DECDBD]/60 dark:border-[#3A2F22]"
                  >
                    <div>
                      <p className="font-semibold text-xs text-[#2A241E] dark:text-[#FAF7F2]">
                        {t.chapterLabel} {item.chapter}, {t.shlokaLabel} {item.verse}
                      </p>
                      <p className="text-[10px] text-[#8C806F] mt-0.5">{item.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A89D8D]" />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#2A241E] dark:bg-[#E8C581] text-white dark:text-[#1F1912] text-xs font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate Modal */}
      <AnimatePresence>
        {showRateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#382F24] p-6 text-center space-y-4 shadow-2xl"
            >
              <button
                onClick={() => setShowRateModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#FFF4DC] dark:bg-[#352B1C] text-[#C59341] mx-auto flex items-center justify-center shadow-xs">
                <Heart className="w-6 h-6 fill-current text-[#C59341]" />
              </div>

              <h3 className="font-serif text-lg font-bold text-[#2A241E] dark:text-[#FAF7F2]">
                Love the Gita App?
              </h3>

              <p className="text-xs text-[#5E5242] dark:text-[#C5B9A8] leading-relaxed">
                Your blessing and 5-star rating help deliver Lord Krishna's eternal knowledge to seekers across humanity.
              </p>

              <div className="flex justify-center gap-1.5 text-[#C59341] py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.div whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.9 }} key={s}>
                    <Star className="w-7 h-7 fill-current cursor-pointer" />
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowRateModal(false);
                  alert('Thank you for supporting the Gita App! ॐ ❤️');
                }}
                className="w-full py-2.5 rounded-xl bg-[#2A241E] dark:bg-[#E8C581] text-white dark:text-[#1F1912] text-xs font-semibold shadow-md active:scale-[0.98] transition-all"
              >
                Rate on Google Play Store
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

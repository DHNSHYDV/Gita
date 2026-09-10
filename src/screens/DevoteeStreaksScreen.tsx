import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Crown, Calendar, Sparkles, CheckCircle2, ChevronLeft, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLeaderboardData, getStoredStreak } from '../data/db';

export const DevoteeStreaksScreen: React.FC = () => {
  const { userName, goBack, t } = useApp();
  const [activeTab, setActiveTab] = useState<'top' | 'my' | 'community'>('top');
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>('today');

  const streakInfo = getStoredStreak();
  const leaderboard = getLeaderboardData(period, userName);

  // Animated rolling counter for streak days
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const target = streakInfo.currentStreak || 72;
    const duration = 1000;
    const stepTime = 20;
    const steps = Math.ceil(duration / stepTime);
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [streakInfo.currentStreak]);

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 select-none transition-colors">
      {/* Top Header - Brought 1 cm below top to keep blank safe region */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))] pb-2 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={goBack}
            className="p-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors text-[#2A241E] dark:text-[#FAF7F2]"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.75]" />
          </motion.button>
          <div>
            <h1 className="font-serif font-bold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
              {t.sadhanaCircle || 'Sadhana Circle'}
            </h1>
            <p className="text-[11px] text-[#8A7E6C] dark:text-[#9B8F7D] font-medium">
              {t.walkingTogether || 'Devotees walking the path together'}
            </p>
          </div>
        </div>

        {/* 3 Main Tabs: Top Readers | My Streak | Community */}
        <div className="flex items-center gap-6 mt-4 relative">
          <button
            onClick={() => setActiveTab('top')}
            className={`pb-2.5 text-xs md:text-sm font-semibold transition-colors relative ${
              activeTab === 'top'
                ? 'text-[#2A241E] dark:text-[#FAF7F2]'
                : 'text-[#8A7E6C] dark:text-[#8D8274] hover:text-[#4A3F30]'
            }`}
          >
            Top Sadhakas
            {activeTab === 'top' && (
              <motion.span
                layoutId="sadhanaTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59341] rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('my')}
            className={`pb-2.5 text-xs md:text-sm font-semibold transition-colors relative ${
              activeTab === 'my'
                ? 'text-[#2A241E] dark:text-[#FAF7F2]'
                : 'text-[#8A7E6C] dark:text-[#8D8274] hover:text-[#4A3F30]'
            }`}
          >
            My Sadhana
            {activeTab === 'my' && (
              <motion.span
                layoutId="sadhanaTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59341] rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`pb-2.5 text-xs md:text-sm font-semibold transition-colors relative ${
              activeTab === 'community'
                ? 'text-[#2A241E] dark:text-[#FAF7F2]'
                : 'text-[#8A7E6C] dark:text-[#8D8274] hover:text-[#4A3F30]'
            }`}
          >
            Sangha
            {activeTab === 'community' && (
              <motion.span
                layoutId="sadhanaTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C59341] rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* Main Tab 1: Top Readers */}
        {activeTab === 'top' && (
          <motion.main
            key="top"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-4 space-y-4 max-w-md mx-auto"
          >
            {/* Subheader & Period Filter */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-sm text-[#2A241E] dark:text-[#FAF7F2]">
                  Daily Wisdom Seekers
                </h2>
                <p className="text-[11px] text-[#8A7E6C] dark:text-[#9B8F7E]">
                  Consistent souls inspired by Krishna's words
                </p>
              </div>

              {/* Time Segment Controls */}
              <div className="flex items-center bg-[#EFE8DD] dark:bg-[#231E18] p-1 rounded-xl text-[11px] font-medium border border-[#E4D9C8] dark:border-[#332A20]">
                {(['today', 'week', 'all'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                      period === p
                        ? 'bg-white dark:bg-[#382F24] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                        : 'text-[#7A6E5D] dark:text-[#9F9382]'
                    }`}
                  >
                    {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ranked List with Staggered Entrance */}
            <div className="space-y-2.5">
              {leaderboard.map((item, idx) => {
                const isCurrent = item.isCurrentUser;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.25 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl transition-all shadow-xs ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#FAF2E5] to-[#F3E2C4] dark:from-[#2F2518] dark:to-[#221A11] border-2 border-[#C59341] shadow-md ring-2 ring-[#C59341]/20'
                        : 'bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Badge or Crown */}
                      <div className="w-6 flex justify-center items-center flex-shrink-0">
                        {item.rank === 1 ? (
                          <Crown className="w-5 h-5 text-[#C59341] fill-[#C59341]" />
                        ) : item.rank === 2 ? (
                          <Crown className="w-5 h-5 text-slate-400 fill-slate-400" />
                        ) : item.rank === 3 ? (
                          <Crown className="w-5 h-5 text-amber-700 fill-amber-700" />
                        ) : (
                          <span className="text-xs font-bold text-[#8A7E6C] dark:text-[#A89D8C]">
                            {item.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                        isCurrent
                          ? 'bg-[#C59341] text-white border-[#A8792C]'
                          : 'bg-[#EFE8DD] dark:bg-[#282117] border-[#D5C9B7] dark:border-[#382F24] text-[#8C6D3F] dark:text-[#E8C581]'
                      }`}>
                        {item.name[0]}
                      </div>

                      {/* Username & Quote */}
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <h3
                            className={`text-xs md:text-sm truncate ${
                              isCurrent
                                ? 'text-[#2A1E11] dark:text-[#FAF7F2] font-bold'
                                : 'text-[#2A241E] dark:text-[#FAF7F2] font-semibold'
                            }`}
                          >
                            {item.name}
                          </h3>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C59341] text-white tracking-wider uppercase">
                              You
                            </span>
                          )}
                        </div>
                        {item.quote && (
                          <p className="text-[10px] text-[#8A7E6C] dark:text-[#A89D8C] italic truncate">
                            "{item.quote}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Flame Streak Badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF2E6] dark:bg-[#2B2319] border border-[#EBD7BE] dark:border-[#3D3122] text-[#D97706] dark:text-[#FBBF24] text-xs font-bold flex-shrink-0 shadow-2xs">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{item.streakDays}d</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Motivation Card */}
            <div className="mt-6 rounded-2xl p-4 bg-gradient-to-r from-[#FAF2E6] via-[#F5ECE0] to-[#EFE4D2] dark:from-[#241E17] dark:via-[#1E1913] dark:to-[#17130F] border border-[#E7D6C1] dark:border-[#352A1C] text-center shadow-xs">
              <p className="font-serif text-xs md:text-sm text-[#4A3D2D] dark:text-[#D5C7B2] font-medium">
                "Small continuous steps lead to eternal transformation."
              </p>
              <p className="text-xs font-bold text-[#D97706] dark:text-[#FBBF24] mt-1 flex items-center justify-center gap-1.5">
                <span>Keep your sadhana glowing</span>
                <Flame className="w-3.5 h-3.5 fill-current" />
              </p>
            </div>
          </motion.main>
        )}

        {/* Main Tab 2: My Streak */}
        {activeTab === 'my' && (
          <motion.main
            key="my"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-4 space-y-4 max-w-md mx-auto"
          >
            {/* Big Streak Hero Counter with Glowing Flame Aura */}
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#FAF4EA] to-[#EFE3CF] dark:from-[#261E16] dark:to-[#1A1510] border border-[#E8D6BD] dark:border-[#3E3020] text-center shadow-sm overflow-hidden">
              {/* Flame Halo Aura */}
              <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.35, 0.6, 0.35],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-[#D97706] filter blur-xl"
                />
                <div className="relative z-10 w-16 h-16 rounded-full bg-[#FCECD8] dark:bg-[#3A2D1F] flex items-center justify-center text-[#D97706] shadow-md border border-[#E8C581]/40">
                  <Flame className="w-9 h-9 fill-current" />
                </div>
              </div>

              <h2 className="font-serif text-5xl font-extrabold text-[#2B2113] dark:text-[#FAF7F2] tracking-tight">
                {displayCount}
                <span className="text-xl font-medium text-[#8A7E6C] dark:text-[#B5A591] ml-2">
                  Days
                </span>
              </h2>
              <p className="text-xs font-medium text-[#7D6E5A] dark:text-[#B5A591] mt-1.5">
                Consecutive Devotional Reading Streak
              </p>

              {/* Streak Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[#DECDBD] dark:border-[#35291C]">
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#251E17]/80 border border-[#E8DED1] dark:border-[#362D21]">
                  <p className="text-[11px] text-[#8A7C68]">Longest Sadhana</p>
                  <p className="font-serif text-lg font-bold text-[#2A241E] dark:text-[#FAF7F2] mt-0.5">
                    {streakInfo.longestStreak} days
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#251E17]/80 border border-[#E8DED1] dark:border-[#362D21]">
                  <p className="text-[11px] text-[#8A7C68]">Verses Contemplated</p>
                  <p className="font-serif text-lg font-bold text-[#2A241E] dark:text-[#FAF7F2] mt-0.5">
                    {streakInfo.totalVersesRead}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Check-in Days */}
            <div className="rounded-2xl p-4 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-bold text-[#2A241E] dark:text-[#FAF7F2] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C59341]" />
                  This Week's Journey
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Today
                </span>
              </div>

              <div className="flex justify-between items-center px-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-[#8A7E6C]">{day}</span>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                        idx <= 4
                          ? 'bg-[#C59341] text-white shadow-xs'
                          : 'bg-[#EFE8DD] dark:bg-[#282117] text-[#A89D8D]'
                      }`}
                    >
                      {idx <= 4 ? <Flame className="w-3.5 h-3.5 fill-current" /> : '•'}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.main>
        )}

        {/* Main Tab 3: Community */}
        {activeTab === 'community' && (
          <motion.main
            key="community"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-4 space-y-4 max-w-md mx-auto text-center"
          >
            <div className="rounded-3xl p-6 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F2E5D0] dark:bg-[#2E2417] text-[#C59341] dark:text-[#E8C581] mx-auto flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 stroke-[1.75]" />
              </div>

              <h2 className="font-serif text-xl font-bold text-[#2A241E] dark:text-[#FAF7F2]">
                Global Gita Sangha
              </h2>

              <p className="text-xs text-[#6B5E4E] dark:text-[#B5A896] leading-relaxed">
                You are reading alongside <span className="font-bold text-[#C59341] dark:text-[#E8C581]">14,280+ devotees</span> across 42 countries who start every single dawn with sacred Gita shlokas.
              </p>

              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-[#F6EFE3] dark:bg-[#261E16] text-xs text-[#4A3D2C] dark:text-[#E0D3BF] border border-[#E8DDCF] dark:border-[#382E22] leading-relaxed font-serif italic">
                  "One who reads even half a shloka daily with reverence is freed from all distress and attains clarity of intellect."
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#8A7E6C]">
                <Award className="w-4 h-4 text-[#C59341]" />
                <span>Devotion • Consistency • Transformation</span>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

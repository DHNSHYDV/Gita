import React, { useState } from 'react';
import { Flame, Crown, User, Calendar, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLeaderboardData, getStoredStreak } from '../data/db';

export const DevoteeStreaksScreen: React.FC = () => {
  const { userName } = useApp();
  const [activeTab, setActiveTab] = useState<'top' | 'my' | 'community'>('top');
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>('today');

  const streakInfo = getStoredStreak();
  const leaderboard = getLeaderboardData(period, userName);

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-24 select-none transition-colors animate-fadeIn">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-5 pt-6 pb-2 border-b border-[#EAE2D5] dark:border-[#28221B]">
        <h1 className="font-semibold text-xl text-[#2A241E] dark:text-[#FAF7F2]">
          Devotee Streaks
        </h1>

        {/* 3 Main Tabs: Top Readers | My Streak | Community */}
        <div className="flex items-center gap-6 mt-4">
          <button
            onClick={() => setActiveTab('top')}
            className={`pb-2 text-xs md:text-sm font-semibold transition-all relative ${
              activeTab === 'top'
                ? 'text-[#2A241E] dark:text-[#FAF7F2]'
                : 'text-[#8A7E6C] dark:text-[#8D8274] hover:text-[#4A3F30]'
            }`}
          >
            Top Readers
            {activeTab === 'top' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#966C28] dark:bg-[#E8C581] rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my')}
            className={`pb-2 text-xs md:text-sm font-semibold transition-all relative ${
              activeTab === 'my'
                ? 'text-[#2A241E] dark:text-[#FAF7F2]'
                : 'text-[#8A7E6C] dark:text-[#8D8274] hover:text-[#4A3F30]'
            }`}
          >
            My Streak
            {activeTab === 'my' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#966C28] dark:bg-[#E8C581] rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`pb-2 text-xs md:text-sm font-semibold transition-all relative ${
              activeTab === 'community'
                ? 'text-[#2A241E] dark:text-[#FAF7F2]'
                : 'text-[#8A7E6C] dark:text-[#8D8274] hover:text-[#4A3F30]'
            }`}
          >
            Community
            {activeTab === 'community' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#966C28] dark:bg-[#E8C581] rounded-full"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Tab 1: Top Readers (The Leaderboard from storyboard) */}
      {activeTab === 'top' && (
        <main className="px-5 py-4 space-y-4 max-w-md mx-auto">
          {/* Subheader & Period Filter */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#2A241E] dark:text-[#FAF7F2]">
                Readers of Today
              </h2>
              <p className="text-[11px] text-[#8A7E6C] dark:text-[#9B8F7E]">
                People who showed up for wisdom
              </p>
            </div>

            {/* Time Segment Controls: Today | This Week | All Time */}
            <div className="flex items-center bg-[#EFE8DD] dark:bg-[#231E18] p-1 rounded-xl text-[11px] font-medium">
              <button
                onClick={() => setPeriod('today')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  period === 'today'
                    ? 'bg-white dark:bg-[#382F24] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                    : 'text-[#7A6E5D] dark:text-[#9F9382]'
                }`}
              >
                Today
              </button>

              <button
                onClick={() => setPeriod('week')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  period === 'week'
                    ? 'bg-white dark:bg-[#382F24] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                    : 'text-[#7A6E5D] dark:text-[#9F9382]'
                }`}
              >
                This Week
              </button>

              <button
                onClick={() => setPeriod('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  period === 'all'
                    ? 'bg-white dark:bg-[#382F24] text-[#2A241E] dark:text-[#FAF7F2] shadow-xs font-semibold'
                    : 'text-[#7A6E5D] dark:text-[#9F9382]'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Ranked List */}
          <div className="space-y-2.5">
            {leaderboard.map((item) => {
              const isTopThree = item.rank <= 3;
              const isCurrent = item.isCurrentUser;

              return (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all shadow-xs ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#F7EBD8] to-[#F1DFC4] dark:from-[#2F261B] dark:to-[#241D14] border-2 border-[#C59341] shadow-md'
                      : 'bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge or Crown */}
                    <div className="w-6 flex justify-center items-center flex-shrink-0">
                      {item.rank === 1 ? (
                        <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
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
                    <div className="w-9 h-9 rounded-full bg-[#EFE8DD] dark:bg-[#282117] border border-[#D5C9B7] dark:border-[#382F24] flex items-center justify-center text-[#8C6D3F] dark:text-[#E8C581] font-bold text-xs flex-shrink-0">
                      {item.name[0]}
                    </div>

                    {/* Username & Quote */}
                    <div>
                      <h3
                        className={`text-xs md:text-sm font-semibold ${
                          isCurrent
                            ? 'text-[#2A1E11] dark:text-[#FAF7F2] font-bold'
                            : 'text-[#2A241E] dark:text-[#FAF7F2]'
                        }`}
                      >
                        {item.name}
                      </h3>
                      {item.quote && (
                        <p className="text-[10px] text-[#8A7E6C] dark:text-[#A89D8C] italic">
                          "{item.quote}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Flame Streak Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF2E6] dark:bg-[#2B2319] border border-[#EBD7BE] dark:border-[#3D3122] text-[#C26B1E] dark:text-[#E89547] text-xs font-bold flex-shrink-0">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{item.streakDays} days</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Motivation Card */}
          <div className="mt-6 rounded-2xl p-4 bg-gradient-to-r from-[#FAF2E6] via-[#F5ECE0] to-[#EFE4D2] dark:from-[#241E17] dark:via-[#1E1913] dark:to-[#17130F] border border-[#E7D6C1] dark:border-[#352A1C] text-center shadow-xs">
            <p className="font-serif text-xs md:text-sm text-[#4A3D2D] dark:text-[#D5C7B2] font-medium">
              Small steps. Big transformation.
            </p>
            <p className="text-xs font-bold text-[#C26B1E] dark:text-[#E89547] mt-0.5 flex items-center justify-center gap-1">
              <span>Keep your streak alive!</span>
              <Flame className="w-3.5 h-3.5 fill-current" />
            </p>
          </div>
        </main>
      )}

      {/* Main Tab 2: My Streak */}
      {activeTab === 'my' && (
        <main className="px-5 py-4 space-y-4 max-w-md mx-auto">
          {/* Big Streak Hero Counter */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#FAF4EA] to-[#EFE3CF] dark:from-[#261E16] dark:to-[#1A1510] border border-[#E8D6BD] dark:border-[#3E3020] text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FCECD8] dark:bg-[#3A2D1F] mx-auto flex items-center justify-center text-[#D96B1C] mb-3 shadow-inner">
              <Flame className="w-9 h-9 fill-current animate-bounce" />
            </div>

            <h2 className="font-serif text-4xl font-extrabold text-[#2B2113] dark:text-[#FAF7F2]">
              {streakInfo.currentStreak} Days
            </h2>
            <p className="text-xs font-medium text-[#7D6E5A] dark:text-[#B5A591] mt-1">
              Current Devotional Reading Streak
            </p>

            {/* Streak Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[#DECDBD] dark:border-[#35291C]">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#251E17]/70">
                <p className="text-[11px] text-[#8A7C68]">Longest Streak</p>
                <p className="text-base font-bold text-[#2A241E] dark:text-[#FAF7F2] mt-0.5">
                  {streakInfo.longestStreak} days
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#251E17]/70">
                <p className="text-[11px] text-[#8A7C68]">Verses Read</p>
                <p className="text-base font-bold text-[#2A241E] dark:text-[#FAF7F2] mt-0.5">
                  {streakInfo.totalVersesRead}
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Check-in Days */}
          <div className="rounded-2xl p-4 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#2A241E] dark:text-[#FAF7F2] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#966C28]" />
                This Week's Sadhana
              </span>
              <span className="text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Today
              </span>
            </div>

            <div className="flex justify-between items-center px-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-[#8A7E6C]">{day}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx <= 4
                        ? 'bg-[#C26B1E] text-white shadow-xs'
                        : 'bg-[#EFE8DD] dark:bg-[#282117] text-[#A89D8D]'
                    }`}
                  >
                    {idx <= 4 ? <Flame className="w-3.5 h-3.5 fill-current" /> : '•'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Main Tab 3: Community */}
      {activeTab === 'community' && (
        <main className="px-5 py-4 space-y-4 max-w-md mx-auto text-center">
          <div className="rounded-3xl p-6 bg-[#FAF7F2] dark:bg-[#1C1813] border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E5D0] dark:bg-[#2E2417] text-[#966C28] dark:text-[#E8C581] mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-lg font-bold text-[#2A241E] dark:text-[#FAF7F2]">
              Global Gita Sangha
            </h2>

            <p className="text-xs text-[#6B5E4E] dark:text-[#B5A896] leading-relaxed">
              You are reading alongside <span className="font-bold text-[#966C28] dark:text-[#E8C581]">14,280+ devotees</span> across 42 countries who start their day with sacred Gita shlokas.
            </p>

            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-[#F6EFE3] dark:bg-[#261E16] text-xs text-[#4A3D2C] dark:text-[#E0D3BF]">
                "One who reads even half a shloka daily with reverence is freed from all fears."
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

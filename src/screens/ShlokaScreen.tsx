import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Volume2,
  VolumeX,
  Bookmark as BookmarkIcon,
  Share2,
  Type,
  Check,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { getVerse } from '../data/verses';
import { audioPlayer } from '../utils/audio';
import { recordReadingForStreak } from '../data/db';
import { syncDevoteeProgress } from '../utils/supabase';
import { Language, TextSize } from '../types';
import { ShareStatusModal } from '../components/ShareStatusModal';

interface VerseCardProps {
  chapterNumber: number;
  verseNumber: number;
  language: Language;
  textSize: TextSize;
  isPlaying?: boolean;
  isAudioLoading?: boolean;
  audioMode?: 'chant' | 'speech' | null;
  bookmarked?: boolean;
  copied?: boolean;
  onPlayAudio?: () => void;
  onPlaySpeech?: (text: string) => void;
  onToggleBookmark?: () => void;
  onShare?: () => void;
  onCycleTextSize?: () => void;
  meaningTitle: string;
  purportTitle: string;
  playLabel: string;
  stopLabel: string;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  shareLabel: string;
  textSizeLabel: string;
  direction?: number;
}

const VerseCard: React.FC<VerseCardProps> = ({
  chapterNumber,
  verseNumber,
  language,
  textSize,
  isPlaying = false,
  isAudioLoading = false,
  audioMode = null,
  bookmarked = false,
  copied = false,
  onPlayAudio,
  onPlaySpeech,
  onToggleBookmark,
  onShare,
  onCycleTextSize,
  meaningTitle,
  purportTitle,
  playLabel,
  stopLabel,
  bookmarkLabel,
  bookmarkedLabel,
  shareLabel,
  textSizeLabel,
  direction = 1,
}) => {
  const [activeTab, setActiveTab] = useState<'meaning' | 'purport'>('meaning');
  const verseData = getVerse(chapterNumber, verseNumber);
  const translationData = verseData.translations[language] || verseData.translations.en;

  const shlokaFontSizeClass =
    textSize === 'sm'
      ? 'text-lg leading-[1.9]'
      : textSize === 'lg'
      ? 'text-2xl md:text-3xl leading-[2.2]'
      : 'text-xl md:text-2xl leading-[2.1]';

  const bodyFontSizeClass =
    textSize === 'sm' ? 'text-xs' : textSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="space-y-4 select-none">
      {/* Sacred Sanskrit Shloka Box */}
      <motion.div
        initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-b from-[#FDF8EE] via-[#F9F1E2] to-[#F2E8D7] dark:from-[#241D15] dark:via-[#1D1711] dark:to-[#16120D] border border-[#E7D6BD] dark:border-[#382B1E] shadow-sm text-center transition-colors"
      >
        {/* Sacred Decorative Accent */}
        <div className="flex items-center justify-center gap-2 mb-3.5 text-[#C59341] dark:text-[#E8C581] opacity-75">
          <span className="h-[0.5px] w-8 bg-[#C59341]/40"></span>
          <span className="text-[10px] tracking-widest font-serif">✦ ॐ ✦</span>
          <span className="h-[0.5px] w-8 bg-[#C59341]/40"></span>
        </div>

        <p
          className={`font-sanskrit font-bold text-[#231A0F] dark:text-[#F7EFE3] whitespace-pre-line tracking-wide ${shlokaFontSizeClass}`}
        >
          {translationData.scriptShloka}
        </p>

        {language !== 'hi' && (
          <p className="mt-3.5 text-xs text-[#82745F] dark:text-[#A79884] italic font-serif opacity-90 tracking-wide border-t border-[#E8D9C5]/50 dark:border-[#33261A]/50 pt-2.5">
            {verseData.transliteration}
          </p>
        )}
      </motion.div>

      {/* Action Bar */}
      <div className="grid grid-cols-4 gap-2 bg-[#FAF7F2] dark:bg-[#1C1813] p-1.5 rounded-2xl border border-[#E8E1D5] dark:border-[#2D261E] shadow-xs">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onPlayAudio}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            isPlaying && audioMode === 'chant'
              ? 'text-[#966C28] dark:text-[#E8C581] bg-[#F2E5D0] dark:bg-[#2F271B] font-semibold'
              : 'text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A]'
          }`}
        >
          {isPlaying && audioMode === 'chant' ? (
            isAudioLoading ? (
              <div className="flex items-center justify-center h-5">
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              </div>
            ) : (
              <div className="flex items-center gap-0.5 h-5">
                <span className="w-1 h-3 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-4 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-2 bg-current rounded-full animate-bounce" />
              </div>
            )
          ) : (
            <Volume2 className="w-5 h-5" strokeWidth={1.75} />
          )}
          <span className="text-[11px] mt-1 font-medium">
            {isPlaying && audioMode === 'chant' ? (isAudioLoading ? 'Buffering...' : stopLabel) : 'Chant'}
          </span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onToggleBookmark}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            bookmarked
              ? 'text-[#966C28] dark:text-[#E8C581] bg-[#F2E5D0] dark:bg-[#2F271B] font-semibold'
              : 'text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A]'
          }`}
        >
          <motion.div
            animate={{ scale: bookmarked ? [1, 1.18, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <BookmarkIcon
              className="w-5 h-5"
              strokeWidth={1.75}
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </motion.div>
          <span className="text-[11px] mt-1 font-medium">{bookmarked ? bookmarkedLabel : bookmarkLabel}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onShare}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A] transition-all"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-600" strokeWidth={2} /> : <Share2 className="w-5 h-5" strokeWidth={1.75} />}
          <span className="text-[11px] mt-1 font-medium">{copied ? 'Copied' : shareLabel}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onCycleTextSize}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A] transition-all"
        >
          <div className="flex items-center gap-0.5">
            <Type className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-[10px] font-bold uppercase">{textSize}</span>
          </div>
          <span className="text-[11px] mt-1 font-medium">{textSizeLabel}</span>
        </motion.button>
      </div>

      {/* Tabbed Explanation Container with Delayed Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl p-5 bg-[#FAF7F2] dark:bg-[#1B1713] border border-[#E8E1D5] dark:border-[#2E261E] shadow-xs"
      >
        {/* Sliding Tab Header with Regional Accent Listen Button */}
        <div className="flex items-center justify-between border-b border-[#EAE1D3] dark:border-[#2D251C] pb-2 mb-3.5 relative">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setActiveTab('meaning')}
              className={`text-xs md:text-sm font-semibold transition-colors pb-1 relative ${
                activeTab === 'meaning'
                  ? 'text-[#2A231A] dark:text-[#FAF7F2]'
                  : 'text-[#827666] dark:text-[#8C8072] hover:text-[#4A3D2E]'
              }`}
            >
              {meaningTitle}
              {activeTab === 'meaning' && (
                <motion.div
                  layoutId="activeMeaningTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#966C28] dark:bg-[#E8C581] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('purport')}
              className={`text-xs md:text-sm font-semibold transition-colors pb-1 relative ${
                activeTab === 'purport'
                  ? 'text-[#2A231A] dark:text-[#FAF7F2]'
                  : 'text-[#827666] dark:text-[#8C8072] hover:text-[#4A3D2E]'
              }`}
            >
              {purportTitle}
              {activeTab === 'purport' && (
                <motion.div
                  layoutId="activeMeaningTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#966C28] dark:bg-[#E8C581] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
            </button>
          </div>

          {/* Regional Accent Speech Button */}
          <button
            onClick={() => {
              const text = activeTab === 'meaning' ? translationData.translation : translationData.purport;
              if (onPlaySpeech) onPlaySpeech(text);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              isPlaying && audioMode === 'speech'
                ? 'bg-[#C59341] text-white shadow-xs'
                : 'bg-[#EAE0D0]/80 dark:bg-[#282119]/80 text-[#6E6353] dark:text-[#AFA494] hover:text-[#2A241E] dark:hover:text-[#FAF7F2]'
            }`}
            title="Listen to explanation in regional accent"
          >
            {isPlaying && audioMode === 'speech' ? (
              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{isPlaying && audioMode === 'speech' ? stopLabel : 'Listen'}</span>
          </button>
        </div>

        {/* Tab Content Crossfade */}
        <AnimatePresence mode="wait">
          {activeTab === 'meaning' ? (
            <motion.p
              key="meaning"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`text-[#3F3528] dark:text-[#D8CDBE] leading-relaxed ${bodyFontSizeClass}`}
            >
              {translationData.translation}
            </motion.p>
          ) : (
            <motion.p
              key="purport"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`text-[#4D4233] dark:text-[#CBBFAF] leading-relaxed ${bodyFontSizeClass}`}
            >
              {translationData.purport}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export const ShlokaScreen: React.FC = () => {
  const {
    language,
    selectedChapter,
    setSelectedChapter,
    selectedVerse,
    setSelectedVerse,
    textSize,
    setTextSize,
    setCurrentScreen,
    goBack,
    setOpenSettingsFromScreen,
    isBookmarked,
    toggleBookmark,
    setLastRead,
    awardListenPoint,
    t,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<'chant' | 'speech' | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const currentChapterData = CHAPTERS_DATA.find((c) => c.number === selectedChapter) || CHAPTERS_DATA[1];
  const totalVersesInChapter = currentChapterData.versesCount;

  // Sync reading position to streak and last-read, and stop previous audio
  useEffect(() => {
    setLastRead({ chapter: selectedChapter, verse: selectedVerse });
    const streak = recordReadingForStreak();
    syncDevoteeProgress({
      streak: streak.currentStreak,
      lastRead: { chapter: selectedChapter, verse: selectedVerse }
    });
    audioPlayer.stop();
  }, [selectedChapter, selectedVerse]);

  // Handle audio state
  useEffect(() => {
    audioPlayer.setListener((playing: boolean, mode: 'chant' | 'speech' | null, loading?: boolean) => {
      setIsPlaying(playing);
      setAudioMode(mode);
      setIsAudioLoading(!!loading);
    });
    return () => {
      audioPlayer.setListener(() => {});
      audioPlayer.stop();
    };
  }, []);

  const handleNextVerse = () => {
    setTurnDirection('next');
    if (selectedVerse < totalVersesInChapter) {
      setSelectedVerse(selectedVerse + 1);
    } else if (selectedChapter < 18) {
      setSelectedChapter(selectedChapter + 1);
      setSelectedVerse(1);
    }
  };

  const handlePrevVerse = () => {
    setTurnDirection('prev');
    if (selectedVerse > 1) {
      setSelectedVerse(selectedVerse - 1);
    } else if (selectedChapter > 1) {
      const prevChapter = CHAPTERS_DATA.find((c) => c.number === selectedChapter - 1);
      if (prevChapter) {
        setSelectedChapter(prevChapter.number);
        setSelectedVerse(prevChapter.versesCount);
      }
    }
  };

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) handleNextVerse();
      else handlePrevVerse();
    }
  };

  // Toggle authentic Sanskrit temple chanting with fallback
  const handlePlayAudio = () => {
    awardListenPoint(selectedChapter, selectedVerse);
    const verseData = getVerse(selectedChapter, selectedVerse);
    audioPlayer.toggleChant(selectedChapter, selectedVerse, verseData.sanskrit);
  };

  // Toggle regional voice recitation of translation
  const handlePlaySpeech = (text: string) => {
    awardListenPoint(selectedChapter, selectedVerse);
    audioPlayer.toggleRegionalSpeech(text, language);
  };

  // Bookmark with discreet toast
  const handleToggleBookmark = () => {
    const currentVerseId = `${selectedChapter}.${selectedVerse}`;
    const willBookmark = !isBookmarked(currentVerseId);
    toggleBookmark(currentVerseId);
    setBookmarkToast(willBookmark ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
    setTimeout(() => {
      setBookmarkToast(null);
    }, 1600);
  };

  // Share verse via Sacred WhatsApp Status & Story Card
  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleCycleTextSize = () => {
    if (textSize === 'sm') setTextSize('md');
    else if (textSize === 'md') setTextSize('lg');
    else setTextSize('sm');
  };

  const currentVerseId = `${selectedChapter}.${selectedVerse}`;
  const bookmarked = isBookmarked(currentVerseId);

  return (
    <div
      className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-32 transition-colors select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header - Brought 1 cm below top to keep blank safe region */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))] pb-3 flex items-center justify-between border-b border-[#EAE2D5] dark:border-[#28221B]">
        <button
          onClick={goBack}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors active:scale-95"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 text-[#2A241E] dark:text-[#FAF7F2]" strokeWidth={1.75} />
        </button>

        <div className="text-center flex-1 mx-2">
          <p className="text-xs font-medium text-[#8A7E6C] dark:text-[#A89D8C] tracking-wide uppercase">
            {t.chapterLabel} {selectedChapter}
          </p>
          <h1 className="font-serif font-bold text-sm md:text-base text-[#2A241E] dark:text-[#FAF7F2] truncate">
            {currentChapterData.title[language]}
          </h1>
        </div>

        <button
          onClick={() => {
            setOpenSettingsFromScreen('shloka');
            setCurrentScreen('settings');
          }}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors text-[#6E6353] dark:text-[#B0A595] active:scale-95"
          title="Settings"
        >
          <Settings className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </header>

      {/* Main Reading Page */}
      <main className="px-5 py-4 max-w-md md:max-w-xl mx-auto space-y-4">
        {/* Shloka Stepper Header */}
        <div className="flex items-center justify-between px-2 py-1">
          <button
            onClick={handlePrevVerse}
            className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] text-[#7A6E5D] dark:text-[#B5A997] transition-all active:scale-90"
            title="Previous Shloka"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-xs md:text-sm text-[#4A3F30] dark:text-[#D5C6AF] tracking-wide">
              {t.shlokaLabel} {selectedVerse} / {totalVersesInChapter}
            </span>
            <span className="text-[10px] text-[#A39684] dark:text-[#7A7062] tracking-wider">
              Swipe left or right to turn page
            </span>
          </div>

          <button
            onClick={handleNextVerse}
            className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] text-[#7A6E5D] dark:text-[#B5A997] transition-all active:scale-90"
            title="Next Shloka"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Shloka Card with Directional Content Flow */}
        <AnimatePresence mode="wait">
          <VerseCard
            key={`${selectedChapter}.${selectedVerse}`}
            chapterNumber={selectedChapter}
            verseNumber={selectedVerse}
            language={language}
            textSize={textSize}
            isPlaying={isPlaying}
            isAudioLoading={isAudioLoading}
            audioMode={audioMode}
            bookmarked={bookmarked}
            copied={copied}
            onPlayAudio={handlePlayAudio}
            onPlaySpeech={handlePlaySpeech}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
            onCycleTextSize={handleCycleTextSize}
            meaningTitle={t.meaningTitle}
            purportTitle={t.purportTitle}
            playLabel={t.play}
            stopLabel={t.stop}
            bookmarkLabel={t.bookmark}
            bookmarkedLabel={t.bookmarked}
            shareLabel={t.share}
            textSizeLabel={t.textSize}
            direction={turnDirection === 'next' ? 1 : -1}
          />
        </AnimatePresence>
      </main>

      {/* Discreet Bookmark Confirmation Pill */}
      {bookmarkToast && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2A241E]/95 dark:bg-[#FAF7F2]/95 text-white dark:text-[#1F1912] text-xs font-semibold shadow-xl backdrop-blur-md pointer-events-none tracking-wide flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C59341]" />
          <span>{bookmarkToast}</span>
        </motion.div>
      )}

      {/* Sacred WhatsApp Status & Story Card Modal */}
      {(() => {
        const vData = getVerse(selectedChapter, selectedVerse);
        const tData = vData.translations[language] || vData.translations.en;
        return (
          <ShareStatusModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            data={{
              chapter: selectedChapter,
              verse: selectedVerse,
              sanskrit: vData.sanskrit,
              regionalScriptShloka: tData.scriptShloka,
              transliteration: vData.transliteration,
              bhavartham: tData.translation,
              language,
            }}
          />
        );
      })()}

      {/* Floating Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-xl mx-auto bg-[#FAF7F2]/95 dark:bg-[#181512]/95 backdrop-blur-md border-t border-[#EAE2D5] dark:border-[#28221B] px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-30 flex items-center justify-between shadow-lg">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevVerse}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#665846] dark:text-[#B5A896] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] py-2 px-3.5 rounded-2xl hover:bg-[#EDE3D3] dark:hover:bg-[#25201A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          <span>{t.prevShloka}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNextVerse}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#665846] dark:text-[#B5A896] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] py-2 px-3.5 rounded-2xl hover:bg-[#EDE3D3] dark:hover:bg-[#25201A] transition-colors"
        >
          <span>{t.nextShloka}</span>
          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
        </motion.button>
      </footer>
    </div>
  );
};

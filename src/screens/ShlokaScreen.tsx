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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { getVerse } from '../data/verses';
import { audioPlayer } from '../utils/audio';
import { recordReadingForStreak } from '../data/db';
import { Language, TextSize } from '../types';

interface VerseCardProps {
  chapterNumber: number;
  verseNumber: number;
  language: Language;
  textSize: TextSize;
  isPlaying?: boolean;
  bookmarked?: boolean;
  copied?: boolean;
  onPlayAudio?: () => void;
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
}

const VerseCard: React.FC<VerseCardProps> = ({
  chapterNumber,
  verseNumber,
  language,
  textSize,
  isPlaying = false,
  bookmarked = false,
  copied = false,
  onPlayAudio,
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
}) => {
  const verseData = getVerse(chapterNumber, verseNumber);
  const translationData = verseData.translations[language] || verseData.translations.en;

  const shlokaFontSizeClass =
    textSize === 'sm'
      ? 'text-lg leading-relaxed'
      : textSize === 'lg'
      ? 'text-2xl md:text-3xl leading-loose'
      : 'text-xl md:text-2xl leading-relaxed';

  const bodyFontSizeClass =
    textSize === 'sm' ? 'text-xs' : textSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="space-y-5 select-none">
      {/* Sacred Sanskrit Shloka Box */}
      <div className="rounded-2xl p-6 bg-gradient-to-b from-[#FAF6EF] to-[#F3ECE2] dark:from-[#1D1914] dark:to-[#171410] border border-[#E7DECE] dark:border-[#31291F] shadow-sm text-center transition-colors">
        <p
          className={`font-serif font-bold text-[#231A0F] dark:text-[#F7EFE3] whitespace-pre-line tracking-wide ${shlokaFontSizeClass}`}
        >
          {translationData.scriptShloka}
        </p>

        {language !== 'hi' && (
          <p className="mt-3 text-xs text-[#8A7D69] dark:text-[#9F917E] italic font-serif opacity-85">
            {verseData.transliteration}
          </p>
        )}
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-4 gap-2 bg-[#FAF7F2] dark:bg-[#1C1813] p-2 rounded-2xl border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm">
        <button
          onClick={onPlayAudio}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95 ${
            isPlaying
              ? 'text-[#966C28] dark:text-[#E8C581] bg-[#F2E5D0] dark:bg-[#2F271B] font-semibold'
              : 'text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A]'
          }`}
        >
          {isPlaying ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
          <span className="text-[11px] mt-1 font-medium">{isPlaying ? stopLabel : playLabel}</span>
        </button>

        <button
          onClick={onToggleBookmark}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95 ${
            bookmarked
              ? 'text-[#966C28] dark:text-[#E8C581] bg-[#F2E5D0] dark:bg-[#2F271B] font-semibold'
              : 'text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A]'
          }`}
        >
          <BookmarkIcon
            className="w-5 h-5"
            fill={bookmarked ? 'currentColor' : 'none'}
          />
          <span className="text-[11px] mt-1 font-medium">{bookmarked ? bookmarkedLabel : bookmarkLabel}</span>
        </button>

        <button
          onClick={onShare}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A] transition-all active:scale-95"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
          <span className="text-[11px] mt-1 font-medium">{copied ? 'Copied' : shareLabel}</span>
        </button>

        <button
          onClick={onCycleTextSize}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A] transition-all active:scale-95"
        >
          <div className="flex items-center gap-0.5">
            <Type className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">{textSize}</span>
          </div>
          <span className="text-[11px] mt-1 font-medium">{textSizeLabel}</span>
        </button>
      </div>

      {/* Translation */}
      <div className="space-y-2">
        <h2 className="font-serif font-bold text-base text-[#2A231A] dark:text-[#F3E6D0]">
          {meaningTitle}
        </h2>
        <p className={`text-[#42382B] dark:text-[#D5C9B7] leading-relaxed ${bodyFontSizeClass}`}>
          {translationData.translation}
        </p>
      </div>

      {/* Purport */}
      <div className="space-y-2 pt-1">
        <h2 className="font-serif font-bold text-base text-[#2A231A] dark:text-[#F3E6D0]">
          {purportTitle}
        </h2>
        <p className={`text-[#524637] dark:text-[#C5B9A8] leading-relaxed ${bodyFontSizeClass}`}>
          {translationData.purport}
        </p>
      </div>
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
    t,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Dual-buffer page turn state
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');
  const [outgoingPosition, setOutgoingPosition] = useState<{ chapter: number; verse: number } | null>(null);

  const currentChapterData = CHAPTERS_DATA.find(c => c.number === selectedChapter) || CHAPTERS_DATA[1];
  const totalVersesInChapter = currentChapterData.versesCount;

  // Touch swipe gesture refs
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Listen to audio player state
  useEffect(() => {
    audioPlayer.setListener((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      audioPlayer.stop();
    };
  }, [selectedChapter, selectedVerse]);

  // Update last read position & record reading streak
  useEffect(() => {
    setLastRead({ chapter: selectedChapter, verse: selectedVerse });
    recordReadingForStreak();
  }, [selectedChapter, selectedVerse]);

  // Execute smooth dual-buffer book turn
  const navigateToVerseWithPageTurn = (newChap: number, newVerse: number, dir: 'next' | 'prev') => {
    if (isAnimating) return;

    audioPlayer.stop();
    audioPlayer.playPageTurn();

    // Freeze current verse in the outgoing layer
    setOutgoingPosition({ chapter: selectedChapter, verse: selectedVerse });
    setTurnDirection(dir);
    setIsAnimating(true);

    // Update the active verse state immediately so the incoming buffer is rendered
    setSelectedChapter(newChap);
    setSelectedVerse(newVerse);

    // End transition cleanly after keyframes complete (350ms)
    setTimeout(() => {
      setIsAnimating(false);
      setOutgoingPosition(null);
    }, 350);
  };

  const handlePrevVerse = () => {
    if (selectedVerse > 1) {
      navigateToVerseWithPageTurn(selectedChapter, selectedVerse - 1, 'prev');
    } else if (selectedChapter > 1) {
      const prevChap = CHAPTERS_DATA.find(c => c.number === selectedChapter - 1)!;
      navigateToVerseWithPageTurn(selectedChapter - 1, prevChap.versesCount, 'prev');
    }
  };

  const handleNextVerse = () => {
    if (selectedVerse < totalVersesInChapter) {
      navigateToVerseWithPageTurn(selectedChapter, selectedVerse + 1, 'next');
    } else if (selectedChapter < 18) {
      navigateToVerseWithPageTurn(selectedChapter + 1, 1, 'next');
    }
  };

  // Touch Swipe Gesture Handlers (Smooth finger turn)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe threshold: > 45px and dominant over vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        handleNextVerse();
      } else {
        handlePrevVerse();
      }
    }
  };

  // Toggle audio chanting
  const handlePlayAudio = () => {
    const verseData = getVerse(selectedChapter, selectedVerse);
    const translationData = verseData.translations[language] || verseData.translations.en;
    const textToChant = translationData.scriptShloka || verseData.sanskrit;
    const langCode = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'kn' ? 'kn-IN' : 'sa-IN';
    audioPlayer.toggle(textToChant, langCode);
  };

  // Share verse
  const handleShare = async () => {
    const verseData = getVerse(selectedChapter, selectedVerse);
    const translationData = verseData.translations[language] || verseData.translations.en;
    const shareText = `🕉️ Shreemad Bhagavad Gita - ${t.chapterLabel} ${selectedChapter}.${selectedVerse}\n\n${translationData.scriptShloka}\n\n${t.meaningTitle}:\n${translationData.translation}\n\n${t.purportTitle}:\n${translationData.purport}\n\nShared via Gita App`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gita ${selectedChapter}.${selectedVerse}`,
          text: shareText,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCycleTextSize = () => {
    const nextSize = textSize === 'sm' ? 'md' : textSize === 'md' ? 'lg' : 'sm';
    setTextSize(nextSize);
  };

  const currentVerseId = `${selectedChapter}.${selectedVerse}`;
  const bookmarked = isBookmarked(currentVerseId);

  return (
    <div
      className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-28 transition-colors select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#EAE2D5] dark:border-[#28221B]">
        <button
          onClick={goBack}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 text-[#2A241E] dark:text-[#FAF7F2]" />
        </button>

        <div className="text-center flex-1 mx-2">
          <p className="text-xs font-medium text-[#8A7E6C] dark:text-[#A89D8C]">
            {t.chapterLabel} {selectedChapter}
          </p>
          <h1 className="font-semibold text-sm md:text-base text-[#2A241E] dark:text-[#FAF7F2] truncate">
            {currentChapterData.title[language]}
          </h1>
        </div>

        <button
          onClick={() => {
            setOpenSettingsFromScreen('shloka');
            setCurrentScreen('settings');
          }}
          className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors text-[#6E6353] dark:text-[#B0A595]"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Reading Page */}
      <main className="px-5 py-4 max-w-md mx-auto space-y-4">
        {/* Shloka Stepper: < శ్లోకం 47 / 72 > */}
        <div className="flex items-center justify-between px-2 py-1">
          <button
            onClick={handlePrevVerse}
            disabled={isAnimating}
            className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] text-[#7A6E5D] dark:text-[#B5A997] transition-all active:scale-90"
            title="Previous Shloka"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-semibold text-xs md:text-sm text-[#4A3F30] dark:text-[#D5C6AF] tracking-wide">
              {t.shlokaLabel} {selectedVerse} / {totalVersesInChapter}
            </span>
            <span className="text-[10px] text-[#A39684] dark:text-[#7A7062] tracking-wider">
              Swipe left or right to flip pages
            </span>
          </div>

          <button
            onClick={handleNextVerse}
            disabled={isAnimating}
            className="p-2 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] text-[#7A6E5D] dark:text-[#B5A997] transition-all active:scale-90"
            title="Next Shloka"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Realistic Dual-Buffer Book Stage */}
        <div className="book-stage relative min-h-[420px]">
          {/* Outgoing Page (curls and folds away along book spine) */}
          {isAnimating && outgoingPosition && (
            <div
              className={`absolute inset-0 z-10 ${
                turnDirection === 'next' ? 'book-turn-out-next' : 'book-turn-out-prev'
              }`}
            >
              <VerseCard
                chapterNumber={outgoingPosition.chapter}
                verseNumber={outgoingPosition.verse}
                language={language}
                textSize={textSize}
                isPlaying={false}
                bookmarked={isBookmarked(`${outgoingPosition.chapter}.${outgoingPosition.verse}`)}
                copied={false}
                meaningTitle={t.meaningTitle}
                purportTitle={t.purportTitle}
                playLabel={t.play}
                stopLabel={t.stop}
                bookmarkLabel={t.bookmark}
                bookmarkedLabel={t.bookmarked}
                shareLabel={t.share}
                textSizeLabel={t.textSize}
              />
            </div>
          )}

          {/* Active / Incoming Page */}
          <div
            className={
              isAnimating
                ? turnDirection === 'next'
                  ? 'book-turn-in-next'
                  : 'book-turn-in-prev'
                : ''
            }
          >
            <VerseCard
              chapterNumber={selectedChapter}
              verseNumber={selectedVerse}
              language={language}
              textSize={textSize}
              isPlaying={isPlaying}
              bookmarked={bookmarked}
              copied={copied}
              onPlayAudio={handlePlayAudio}
              onToggleBookmark={() => toggleBookmark(currentVerseId)}
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
            />
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#FAF7F2]/95 dark:bg-[#181512]/95 backdrop-blur-md border-t border-[#EAE2D5] dark:border-[#28221B] px-5 py-3 z-30 flex items-center justify-between shadow-lg">
        <button
          onClick={handlePrevVerse}
          disabled={isAnimating}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#665846] dark:text-[#B5A896] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] py-2 px-3 rounded-xl hover:bg-[#EDE3D3] dark:hover:bg-[#25201A] transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.prevShloka}</span>
        </button>

        <button
          onClick={handleNextVerse}
          disabled={isAnimating}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#665846] dark:text-[#B5A896] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] py-2 px-3 rounded-xl hover:bg-[#EDE3D3] dark:hover:bg-[#25201A] transition-all active:scale-95"
        >
          <span>{t.nextShloka}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};

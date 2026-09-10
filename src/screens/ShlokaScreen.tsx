import React, { useState, useEffect } from 'react';
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
    setOpenSettingsFromScreen,
    isBookmarked,
    toggleBookmark,
    setLastRead,
    t,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev' | null>(null);

  const currentChapterData = CHAPTERS_DATA.find(c => c.number === selectedChapter) || CHAPTERS_DATA[1];
  const verse = getVerse(selectedChapter, selectedVerse);
  const translation = verse.translations[language] || verse.translations.en;

  const totalVersesInChapter = currentChapterData.versesCount;

  // Listen to audio player state
  useEffect(() => {
    audioPlayer.setListener((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      audioPlayer.stop();
    };
  }, [selectedChapter, selectedVerse]);

  // Update last read position
  useEffect(() => {
    setLastRead({ chapter: selectedChapter, verse: selectedVerse });
  }, [selectedChapter, selectedVerse]);

  // Handle verse navigation with 3D book page turn
  const handlePrevVerse = () => {
    audioPlayer.stop();
    setTurnDirection('prev');
    setTimeout(() => {
      if (selectedVerse > 1) {
        setSelectedVerse(selectedVerse - 1);
      } else if (selectedChapter > 1) {
        const prevChap = CHAPTERS_DATA.find(c => c.number === selectedChapter - 1)!;
        setSelectedChapter(selectedChapter - 1);
        setSelectedVerse(prevChap.versesCount);
      }
    }, 180);

    setTimeout(() => {
      setTurnDirection(null);
    }, 450);
  };

  const handleNextVerse = () => {
    audioPlayer.stop();
    setTurnDirection('next');
    setTimeout(() => {
      if (selectedVerse < totalVersesInChapter) {
        setSelectedVerse(selectedVerse + 1);
      } else if (selectedChapter < 18) {
        setSelectedChapter(selectedChapter + 1);
        setSelectedVerse(1);
      }
    }, 180);

    setTimeout(() => {
      setTurnDirection(null);
    }, 450);
  };

  // Toggle audio chanting
  const handlePlayAudio = () => {
    const textToChant = translation.scriptShloka || verse.sanskrit;
    const langCode = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'kn' ? 'kn-IN' : 'sa-IN';
    audioPlayer.toggle(textToChant, langCode);
  };

  // Share verse
  const handleShare = async () => {
    const shareText = `🕉️ Shreemad Bhagavad Gita - ${t.chapterLabel} ${selectedChapter}.${selectedVerse}\n\n${translation.scriptShloka}\n\n${t.meaningTitle}:\n${translation.translation}\n\n${t.purportTitle}:\n${translation.purport}\n\nShared via Gita App`;
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

  // Cycle text size: sm -> md -> lg -> sm
  const handleCycleTextSize = () => {
    const nextSize = textSize === 'sm' ? 'md' : textSize === 'md' ? 'lg' : 'sm';
    setTextSize(nextSize);
  };

  const bookmarked = isBookmarked(verse.id);

  // Dynamic font sizing classes
  const shlokaFontSizeClass =
    textSize === 'sm'
      ? 'text-lg leading-relaxed'
      : textSize === 'lg'
      ? 'text-2xl md:text-3xl leading-loose'
      : 'text-xl md:text-2xl leading-relaxed';

  const bodyFontSizeClass =
    textSize === 'sm' ? 'text-xs' : textSize === 'lg' ? 'text-base' : 'text-sm';

  const pageTurnClass =
    turnDirection === 'next'
      ? 'animate-page-turn-next'
      : turnDirection === 'prev'
      ? 'animate-page-turn-prev'
      : '';

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] pb-28 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-[#F6F1EA]/95 dark:bg-[#141210]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#EAE2D5] dark:border-[#28221B]">
        <button
          onClick={() => setCurrentScreen('chapters')}
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

      {/* Main Reading Page with Realistic 3D Book Turn Perspective */}
      <main className="px-5 py-4 max-w-md mx-auto space-y-5 perspective-book">
        {/* Shloka Stepper: < శ్లోకం 47 / 72 > */}
        <div className="flex items-center justify-between px-2 py-1">
          <button
            onClick={handlePrevVerse}
            className="p-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] text-[#7A6E5D] dark:text-[#B5A997] transition-colors"
            title="Previous Shloka"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-medium text-xs md:text-sm text-[#4A3F30] dark:text-[#D5C6AF] tracking-wide">
            {t.shlokaLabel} {selectedVerse} / {totalVersesInChapter}
          </span>

          <button
            onClick={handleNextVerse}
            className="p-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] text-[#7A6E5D] dark:text-[#B5A997] transition-colors"
            title="Next Shloka"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Sacred Book Page Container */}
        <div className={`space-y-5 ${pageTurnClass}`}>
          {/* Sacred Sanskrit Shloka Box */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-[#FAF6EF] to-[#F3ECE2] dark:from-[#1D1914] dark:to-[#171410] border border-[#E7DECE] dark:border-[#31291F] shadow-sm text-center">
            <p
              className={`font-serif font-bold text-[#231A0F] dark:text-[#F7EFE3] whitespace-pre-line tracking-wide ${shlokaFontSizeClass}`}
            >
              {translation.scriptShloka}
            </p>

            {/* Subtext: Original Sanskrit or Transliteration snippet */}
            {language !== 'hi' && (
              <p className="mt-3 text-xs text-[#8A7D69] dark:text-[#9F917E] italic font-serif opacity-85">
                {verse.transliteration}
              </p>
            )}
          </div>

          {/* Action Bar (Play, Bookmark, Share, Text Size) */}
          <div className="grid grid-cols-4 gap-2 bg-[#FAF7F2] dark:bg-[#1C1813] p-2 rounded-2xl border border-[#E8E1D5] dark:border-[#2D261E] shadow-sm">
            {/* Play */}
            <button
              onClick={handlePlayAudio}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isPlaying
                  ? 'text-[#966C28] dark:text-[#E8C581] bg-[#F2E5D0] dark:bg-[#2F271B] font-semibold'
                  : 'text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A]'
              }`}
            >
              {isPlaying ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
              <span className="text-[11px] mt-1 font-medium">{isPlaying ? t.stop : t.play}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(verse.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                bookmarked
                  ? 'text-[#966C28] dark:text-[#E8C581] bg-[#F2E5D0] dark:bg-[#2F271B] font-semibold'
                  : 'text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A]'
              }`}
            >
              <BookmarkIcon
                className="w-5 h-5"
                fill={bookmarked ? 'currentColor' : 'none'}
              />
              <span className="text-[11px] mt-1 font-medium">{bookmarked ? t.bookmarked : t.bookmark}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A] transition-all"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
              <span className="text-[11px] mt-1 font-medium">{copied ? 'Copied' : t.share}</span>
            </button>

            {/* Text Size */}
            <button
              onClick={handleCycleTextSize}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#6E6353] dark:text-[#9F9382] hover:bg-[#EFE8DC] dark:hover:bg-[#25201A] transition-all"
            >
              <div className="flex items-center gap-0.5">
                <Type className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">{textSize}</span>
              </div>
              <span className="text-[11px] mt-1 font-medium">{t.textSize}</span>
            </button>
          </div>

          {/* భావార్థం (Translation / Meaning) */}
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-base text-[#2A231A] dark:text-[#F3E6D0]">
              {t.meaningTitle}
            </h2>
            <p className={`text-[#42382B] dark:text-[#D5C9B7] leading-relaxed ${bodyFontSizeClass}`}>
              {translation.translation}
            </p>
          </div>

          {/* సారాంశం (Essence / Purport) */}
          <div className="space-y-2 pt-1">
            <h2 className="font-serif font-bold text-base text-[#2A231A] dark:text-[#F3E6D0]">
              {t.purportTitle}
            </h2>
            <p className={`text-[#524637] dark:text-[#C5B9A8] leading-relaxed ${bodyFontSizeClass}`}>
              {translation.purport}
            </p>
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav: Previous Shloka / Next Shloka */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#FAF7F2]/95 dark:bg-[#181512]/95 backdrop-blur-md border-t border-[#EAE2D5] dark:border-[#28221B] px-5 py-3 z-30 flex items-center justify-between">
        <button
          onClick={handlePrevVerse}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#665846] dark:text-[#B5A896] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] py-2 px-3 rounded-xl hover:bg-[#EDE3D3] dark:hover:bg-[#25201A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.prevShloka}</span>
        </button>

        <button
          onClick={handleNextVerse}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#665846] dark:text-[#B5A896] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] py-2 px-3 rounded-xl hover:bg-[#EDE3D3] dark:hover:bg-[#25201A] transition-colors"
        >
          <span>{t.nextShloka}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};

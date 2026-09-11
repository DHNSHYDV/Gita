import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Sun,
  Moon,
  Loader2,
  ExternalLink
} from 'lucide-react';
import {
  VerseShareData,
  shareToStatusOrStory,
  downloadVerseCardImage,
  formatStatusCaption,
  DUMMY_DOWNLOAD_LINK
} from '../utils/shareCard';

interface ShareStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: VerseShareData;
}

export const ShareStatusModal: React.FC<ShareStatusModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [isDarkCard, setIsDarkCard] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setIsGenerating(false);
      setIsDownloading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const res = await shareToStatusOrStory(data, isDarkCard);
      if (res.method === 'fallback') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadVerseCardImage(data, isDarkCard);
    } catch (err) {
      console.warn('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = async () => {
    const caption = formatStatusCaption(data);
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-sm max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF6EE] dark:bg-[#1A1612] border border-[#E6DBC9] dark:border-[#382F24] p-5 shadow-2xl overflow-hidden text-[#2A241E] dark:text-[#FAF7F2]"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D3] dark:border-[#2D251C]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FAF0E1] dark:bg-[#2A2219] text-[#C59341] dark:text-[#E8C581] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm">Share to Status & Story</h3>
                <p className="text-[10px] text-[#8C7E6C] dark:text-[#9F9382]">
                  Bhagavad Gita {data.chapter}.{data.verse}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#8C7E6C] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>

          {/* Theme Selector (Parchment vs Midnight) */}
          <div className="flex items-center justify-center gap-2 pt-3 pb-2">
            <button
              onClick={() => setIsDarkCard(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                !isDarkCard
                  ? 'bg-[#C59341] text-white shadow-xs'
                  : 'bg-[#EDE4D5] dark:bg-[#28211A] text-[#7A6D5B] dark:text-[#A89C8B]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Parchment Gold</span>
            </button>
            <button
              onClick={() => setIsDarkCard(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                isDarkCard
                  ? 'bg-[#E8C581] text-[#1A1612] font-semibold shadow-xs'
                  : 'bg-[#EDE4D5] dark:bg-[#28211A] text-[#7A6D5B] dark:text-[#A89C8B]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Midnight Dark</span>
            </button>
          </div>

          {/* Miniature Live Preview of the Status Card */}
          <div className="flex-1 overflow-y-auto my-2 py-1 px-1">
            <div
              className={`w-full rounded-2xl p-4 border transition-colors shadow-sm relative overflow-hidden text-center space-y-3 ${
                isDarkCard
                  ? 'bg-[#151210] border-[#E8C581]/30 text-[#FAF7F2]'
                  : 'bg-[#FFFDF9] border-[#C59341]/35 text-[#2A241E]'
              }`}
            >
              {/* Om & Header */}
              <div className="space-y-1">
                <span className="text-2xl block">🕉️</span>
                <p className={`text-[10px] font-serif font-bold tracking-widest uppercase ${
                  isDarkCard ? 'text-[#E8C581]' : 'text-[#8C6422]'
                }`}>
                  SHREEMAD BHAGAVAD GITA
                </p>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  CHAPTER {data.chapter} • VERSE {data.verse}
                </div>
              </div>

              {/* Sanskrit Text */}
              <p className="font-serif font-bold text-xs sm:text-sm leading-relaxed px-1">
                {data.sanskrit}
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 opacity-50 py-0.5">
                <div className="h-[1px] w-12 bg-current" />
                <span className="text-[10px]">❖</span>
                <div className="h-[1px] w-12 bg-current" />
              </div>

              {/* Translation */}
              <p className={`text-[11px] leading-relaxed italic px-2 line-clamp-3 ${
                isDarkCard ? 'text-[#C5B9A8]' : 'text-[#5C4F40]'
              }`}>
                "{data.translation}"
              </p>

              {/* App Call To Action Banner */}
              <div className={`mt-2 p-2 rounded-xl border text-[10px] ${
                isDarkCard
                  ? 'bg-[#221C16] border-[#E8C581]/25 text-[#E8C581]'
                  : 'bg-[#F9F4EB] border-[#C59341]/25 text-[#7A561D]'
              }`}>
                <p className="font-bold font-serif">🕉️ Shreemad Bhagavad Gita App</p>
                <p className="text-[9px] opacity-80 mt-0.5">
                  Listen & Read all 700 Shlokas with Sanskrit Audio
                </p>
              </div>
            </div>

            {/* Explanatory Caption */}
            <p className="text-[11px] text-center text-[#8C7E6C] dark:text-[#9F9382] mt-2">
              💡 <em>Viewers can tap the link in your status caption to download the app!</em>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#EAE1D3] dark:border-[#2D251C]">
            {/* Primary: Share to WhatsApp Status / Stories */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating}
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Sacred Card...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 stroke-[2.2]" />
                  <span>Share to WhatsApp Status / Story</span>
                </>
              )}
            </motion.button>

            {/* Secondary Buttons Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isDownloading}
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-xl border border-[#DDD3C2] dark:border-[#382E23] text-xs font-medium text-[#685C4C] dark:text-[#B5A898] hover:bg-[#EFE7D8] dark:hover:bg-[#251E17] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Save Image</span>
              </button>

              <button
                onClick={handleCopyText}
                className="py-2.5 px-3 rounded-xl border border-[#DDD3C2] dark:border-[#382E23] text-xs font-medium text-[#685C4C] dark:text-[#B5A898] hover:bg-[#EFE7D8] dark:hover:bg-[#251E17] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

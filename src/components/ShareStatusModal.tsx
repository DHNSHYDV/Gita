import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import {
  VerseShareData,
  generateVerseCardDataUrl,
  shareToStatusOrStory,
  downloadVerseCardImage,
  formatStatusCaption,
  isWhatsAppAvailable,
  APP_SHARE_URL
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState<boolean>(true);
  const [prepareError, setPrepareError] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const whatsAppInstalled = isWhatsAppAvailable();

  // Generate high-resolution card whenever the modal opens or data changes
  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      setIsPreparing(true);
      setPrepareError(false);
      setPreviewUrl(null);
      setCopiedLink(false);
      setStatusMessage(null);

      // Generate card dynamically for the exact active verse
      generateVerseCardDataUrl(data)
        .then((url) => {
          if (isMounted) {
            setPreviewUrl(url);
            setIsPreparing(false);
          }
        })
        .catch((err) => {
          console.error('Error rendering devotional card:', err);
          if (isMounted) {
            setPrepareError(true);
            setIsPreparing(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, data.chapter, data.verse, data.language, data.sanskrit, data.bhavartham]);

  if (!isOpen) return null;

  const handleWhatsAppShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setStatusMessage(null);

    try {
      const res = await shareToStatusOrStory(data);
      if (res.method === 'whatsapp-direct') {
        setStatusMessage('Opening WhatsApp! 🟢 Tap "My Status" and click the green arrow.');
        setTimeout(() => setStatusMessage(null), 6000);
      } else if (res.method === 'downloaded') {
        setStatusMessage('Card saved to Photos! 📸 Open WhatsApp Status to select it.');
        setTimeout(() => setStatusMessage(null), 6000);
      }
    } catch (err) {
      console.warn('Share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadImage = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadVerseCardImage(data);
      setStatusMessage('Devotional card saved to Photos & Gallery! 📸');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.warn('Save error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_SHARE_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-sm max-h-[92vh] flex flex-col rounded-3xl bg-[#FAF6EE] dark:bg-[#1A1612] border border-[#E6DBC9] dark:border-[#382F24] p-4 sm:p-5 shadow-2xl overflow-hidden text-[#2A241E] dark:text-[#FAF7F2]"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D3] dark:border-[#2D251C]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF0E1] dark:bg-[#2A2219] text-[#C59341] dark:text-[#E8C581] flex items-center justify-center border border-[#E6DBC9] dark:border-[#3D3123]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#2A2219] dark:text-[#FAF6EE]">
                  My Shloka Today
                </h3>
                <p className="text-[11px] text-[#8C7E6C] dark:text-[#9F9382]">
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

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center my-2 py-1 overflow-y-auto">
            {/* 1. Devotional Loading Experience: Shimmer & Golden Radiance */}
            {isPreparing && (
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-4">
                {/* Sacred Golden Shimmer Radiance */}
                <div className="relative flex items-center justify-center w-24 h-24">
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.35, 0.75, 0.35],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E5B55E]/40 to-[#FFDF9E]/60 blur-lg"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute w-20 h-20 rounded-full border border-dashed border-[#C59341]/40"
                  />
                  <div className="w-16 h-16 rounded-full bg-[#FAF0DE] dark:bg-[#2A2016] border border-[#C59341]/50 shadow-inner flex items-center justify-center z-10">
                    <span className="text-2xl font-serif text-[#91631F] dark:text-[#E8C581]">
                      ॐ
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-serif font-semibold text-sm text-[#3E2B1A] dark:text-[#FAF6EE] tracking-wide">
                    Preparing your shloka...
                  </p>
                  <p className="text-[11px] text-[#8C7E6C] dark:text-[#9F9382]">
                    Crafting your sacred devotional card
                  </p>
                </div>
              </div>
            )}

            {/* 2. Error Fallback */}
            {prepareError && !isPreparing && (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <p className="text-xs text-[#5A4B3A] dark:text-[#D5C7B5]">
                  Couldn't prepare the share card. Please try again.
                </p>
                <button
                  onClick={() => {
                    setIsPreparing(true);
                    setPrepareError(false);
                    generateVerseCardDataUrl(data)
                      .then((url) => {
                        setPreviewUrl(url);
                        setIsPreparing(false);
                      })
                      .catch(() => {
                        setPrepareError(true);
                        setIsPreparing(false);
                      });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C59341] text-white text-xs font-semibold"
                >
                  Retry
                </button>
              </div>
            )}

            {/* 3. Actual Generated Card Preview (High-Fidelity 9:16) */}
            {previewUrl && !isPreparing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-[210px] sm:w-[230px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border border-[#E0D2BE] dark:border-[#382E23] bg-[#FAF5EC]">
                  <img
                    src={previewUrl}
                    alt={`Bhagavad Gita Chapter ${data.chapter} Verse ${data.verse}`}
                    className="w-full h-full object-contain select-none pointer-events-none"
                  />
                </div>
                <p className="text-[10px] text-center text-[#8C7E6C] dark:text-[#9F9382] mt-2 italic">
                  Pure scripture • Ready to share to Status & Stories
                </p>
              </motion.div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-2 pt-2 border-t border-[#EAE1D3] dark:border-[#2D251C]">
            {/* Status Feedback Toast */}
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs text-center font-medium shadow-xs"
              >
                {statusMessage}
              </motion.div>
            )}

            {/* Primary Action Button */}
            {whatsAppInstalled ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={isPreparing || isSharing}
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-semibold flex flex-col items-center justify-center shadow-md shadow-[#25D366]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 stroke-[2.2]" />
                  <span className="text-sm font-bold">Share to WhatsApp Status</span>
                </div>
                <span className="text-[10px] text-white/90 font-normal mt-0.5">
                  Opens WhatsApp • Select "My Status" & tap green arrow
                </span>
              </motion.button>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[11px] text-center text-amber-700 dark:text-amber-400 font-medium">
                  WhatsApp isn't available on this device.
                </p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={isPreparing || isSharing}
                  onClick={handleWhatsAppShare}
                  className="w-full py-3 px-4 rounded-2xl bg-[#C59341] hover:bg-[#b08035] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 stroke-[2.2]" />
                  <span className="text-sm font-bold">Share Shloka Card</span>
                </motion.button>
              </div>
            )}

            {/* Secondary Options Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isPreparing || isDownloading}
                onClick={handleDownloadImage}
                className="py-2.5 px-3 rounded-xl border border-[#DDD3C2] dark:border-[#382E23] text-xs font-medium text-[#685C4C] dark:text-[#B5A898] hover:bg-[#EFE7D8] dark:hover:bg-[#251E17] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Photos</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl border border-[#DDD3C2] dark:border-[#382E23] text-xs font-medium text-[#685C4C] dark:text-[#B5A898] hover:bg-[#EFE7D8] dark:hover:bg-[#251E17] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Link Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
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

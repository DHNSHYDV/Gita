import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Sparkles, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import {
  checkForUpdate,
  AppRelease,
  isUpdateDismissedThisSession,
  dismissUpdateForSession,
  downloadAndInstallUpdate,
  CURRENT_VERSION,
} from '../utils/updater';
import { downloadAndApplyLiveUpdate } from '../utils/ota';
import { Capacitor } from '@capacitor/core';

export const UpdateModal: React.FC = () => {
  const [release, setRelease] = useState<AppRelease | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [liveProgress, setLiveProgress] = useState(0);

  useEffect(() => {
    // Check for updates within the 1st 1 second of app open
    const timer = setTimeout(async () => {
      const availableRelease = await checkForUpdate();
      if (availableRelease && !isUpdateDismissedThisSession(availableRelease.tag)) {
        setRelease(availableRelease);
        setIsOpen(true);
      }
    }, 800); // Trigger within 800ms of app launch

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    if (release) {
      dismissUpdateForSession(release.tag);
    }
    setIsOpen(false);
  };

  const handleLiveUpdate = async () => {
    if (!release || !release.otaBundleUrl) return;
    setIsLiveUpdating(true);
    setLiveProgress(10);

    try {
      await downloadAndApplyLiveUpdate(release.version, release.otaBundleUrl, (pct) => {
        setLiveProgress(pct);
      });
    } catch (err) {
      console.error('OTA Live update failed, falling back to APK:', err);
      setIsLiveUpdating(false);
      handleDownload();
    }
  };

  const handleDownload = () => {
    if (!release) return;
    setIsDownloading(true);
    downloadAndInstallUpdate(release.downloadUrl);

    // Provide feedback
    setTimeout(() => {
      setIsDownloading(false);
    }, 4000);
  };

  if (!isOpen || !release) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Sacred Translucent Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Translucent Glassmorphic Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#FAF6EE]/95 dark:bg-[#1A1612]/95 backdrop-blur-2xl border border-[#D5C29E]/60 dark:border-[#3D3325] shadow-2xl p-6 text-[#2A241E] dark:text-[#FAF7F2] transition-colors"
        >
          {/* Top-Right Cross Mark to Ignore for this Session */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A6E5D] dark:text-[#A89C8B] hover:bg-[#EAE0D0] dark:hover:bg-[#2A231A] transition-colors active:scale-95 z-10"
            title="Ignore for now"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Spiritual Lotus / Update Icon */}
          <div className="flex flex-col items-center text-center mt-2">
            <div className="relative mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C59341] to-[#E8C581] text-white shadow-lg shadow-[#C59341]/20">
              <Sparkles className="w-7 h-7 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#FAF6EE] dark:border-[#1A1612] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C59341]/15 text-[#A27222] dark:text-[#E8C581] text-[11px] font-semibold tracking-wide uppercase mb-1.5">
              <span>New Sacred Update</span>
            </div>

            <h2 className="font-serif font-bold text-xl md:text-2xl text-[#2A241E] dark:text-[#FAF7F2]">
              Gita {release.tag}
            </h2>
            <p className="text-xs text-[#7A6E5D] dark:text-[#A89C8B] mt-0.5">
              Current version: v{CURRENT_VERSION} • {release.otaBundleUrl ? `Live OTA: ~${release.otaBundleSizeMb || 1.8} MB` : `APK Size: ~${release.apkSizeMb} MB`}
            </p>
          </div>

          {/* Release Highlights Snippet */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#EFE7DA]/70 dark:bg-[#231D17]/70 border border-[#E2D5C0] dark:border-[#332A20] text-xs text-[#524638] dark:text-[#C5B9A7] space-y-1.5 max-h-36 overflow-y-auto">
            <p className="font-semibold text-[#8C6422] dark:text-[#E8C581] flex items-center gap-1">
              <ArrowRight className="w-3 h-3" /> Highlights in this release:
            </p>
            <p className="leading-relaxed whitespace-pre-line">
              {release.body.replace(/##/g, '').replace(/###/g, '•').slice(0, 240)}
              {release.body.length > 240 ? '...' : ''}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2">
            {release.otaBundleUrl && Capacitor.isNativePlatform() ? (
              <>
                {isLiveUpdating ? (
                  <div className="p-3 rounded-2xl bg-[#FAF0E1] dark:bg-[#282017] border border-[#E8D6BD] dark:border-[#3D3021] space-y-2">
                    <div className="w-full bg-[#E2D4C0] dark:bg-[#382F24] rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-[#C59341] to-[#E8C581] h-full rounded-full"
                        initial={{ width: '10%' }}
                        animate={{ width: `${liveProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold text-[#8C6422] dark:text-[#E8C581]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        Applying Live Update...
                      </span>
                      <span>{liveProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLiveUpdate}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C59341] via-[#D4A359] to-[#C59341] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C59341]/25 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Instant Live Update (~{release.otaBundleSizeMb || 1.8} MB)</span>
                  </button>
                )}

                <button
                  onClick={handleDownload}
                  disabled={isDownloading || isLiveUpdating}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#DDD0BC] dark:border-[#332A1E] text-xs font-medium text-[#7A6E5D] dark:text-[#B0A595] hover:bg-[#EFE8DC] dark:hover:bg-[#251E17] transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full APK (~{release.apkSizeMb} MB)</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C59341] via-[#D4A359] to-[#C59341] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C59341]/25 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Opening Installer...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" strokeWidth={2} />
                    <span>Download & Install Update</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleDismiss}
              disabled={isLiveUpdating}
              className="w-full py-2 text-center text-xs text-[#8A7E6C] dark:text-[#8E8373] hover:text-[#2A241E] dark:hover:text-[#FAF7F2] transition-colors"
            >
              Remind me next time
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

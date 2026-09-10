import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

/**
 * Initialize OTA on app startup.
 * CRITICAL: Must be called immediately at app launch so Capgo confirms the bundle booted.
 */
export async function initOTA(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await CapacitorUpdater.notifyAppReady();
    console.log('🕉️ [OTA] App ready confirmed with Capgo native layer');
  } catch (err) {
    console.warn('⚠️ [OTA] Error notifying Capgo app ready:', err);
  }
}

/**
 * Download and apply a live web bundle over the air (OTA).
 * @param version Version identifier (e.g. '1.4.9')
 * @param bundleUrl Direct download URL for dist.zip
 * @param onProgress Optional progress callback (0 - 100)
 */
export async function downloadAndApplyLiveUpdate(
  version: string,
  bundleUrl: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.warn('[OTA] Live update only supported on native mobile devices');
    return;
  }

  let listenerHandle: { remove: () => void } | null = null;

  try {
    // Listen to download progress if callback provided
    if (onProgress) {
      listenerHandle = await CapacitorUpdater.addListener('download', (info: { percent?: number }) => {
        if (typeof info.percent === 'number') {
          onProgress(Math.round(info.percent));
        }
      });
    }

    console.log(`🕉️ [OTA] Downloading live update ${version} from ${bundleUrl}...`);
    const bundle = await CapacitorUpdater.download({
      version,
      url: bundleUrl,
    });

    console.log(`🕉️ [OTA] Download complete. Setting active bundle: ${bundle.id}`);
    if (onProgress) onProgress(100);

    // Set bundle and reload app immediately
    await CapacitorUpdater.set({ id: bundle.id });
  } catch (err) {
    console.error('❌ [OTA] Live update failed:', err);
    throw err;
  } finally {
    if (listenerHandle) {
      listenerHandle.remove();
    }
  }
}

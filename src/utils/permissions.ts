import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem } from '@capacitor/filesystem';

const APP_PERMISSIONS_PROMPTED_KEY = 'gita_app_permissions_requested_v1';

/**
 * Request both Files/Storage and Notification permissions when the user
 * downloads/opens the app, ensuring seamless daily notifications and gallery saving.
 */
export async function requestAppStartupPermissions(): Promise<void> {
  // 1. Direct native bridge call on Android (forces native OS dialog)
  if (typeof window !== 'undefined' && window.NativeShareBridge?.requestStoragePermissions) {
    try {
      window.NativeShareBridge.requestStoragePermissions();
    } catch (err) {
      console.warn('NativeShareBridge permission trigger error:', err);
    }
  }

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // 2. Request Notification Permissions (for daily sacred morning shloka)
    const notifStatus = await LocalNotifications.checkPermissions();
    if (notifStatus.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
  } catch (err) {
    console.warn('⚠️ [Permissions] Notification permission request error:', err);
  }

  try {
    // 3. Request Filesystem / Storage Permissions (for saving sacred status cards)
    const fsStatus = await Filesystem.checkPermissions();
    if (fsStatus.publicStorage !== 'granted') {
      await Filesystem.requestPermissions();
    }
  } catch (err) {
    console.warn('⚠️ [Permissions] Filesystem permission request error:', err);
  }
}

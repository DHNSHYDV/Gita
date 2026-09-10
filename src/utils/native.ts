import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { ThemeMode } from '../types';

export const updateNativeStatusBar = async (themeMode: ThemeMode) => {
  try {
    const isDark =
      themeMode === 'dark' ||
      (themeMode === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Keep webview content below the physical status bar so it never collides
    await StatusBar.setOverlaysWebView({ overlay: false });

    if (isDark) {
      await StatusBar.setBackgroundColor({ color: '#141210' });
      await StatusBar.setStyle({ style: Style.Dark }); // White icons for dark theme
    } else {
      await StatusBar.setBackgroundColor({ color: '#F6F1EA' });
      await StatusBar.setStyle({ style: Style.Light }); // Black icons for light theme
    }
  } catch {
    // Non-native / browser preview fallback
  }
};

export const registerHardwareBackListener = (
  onBackAction: () => boolean,
  onShowToast?: (msg: string) => void
) => {
  try {
    let lastBackPressTime = 0;

    const listenerPromise = CapApp.addListener('backButton', () => {
      const handled = onBackAction();
      if (!handled) {
        const now = Date.now();
        if (now - lastBackPressTime < 2000) {
          CapApp.exitApp();
        } else {
          lastBackPressTime = now;
          if (onShowToast) {
            onShowToast('Press back again to exit');
          }
        }
      }
    });

    return () => {
      listenerPromise.then(l => l.remove()).catch(() => {});
    };
  } catch {
    return () => {};
  }
};

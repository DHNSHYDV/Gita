import { Capacitor } from '@capacitor/core';
import packageJson from '../../package.json';

export interface AppRelease {
  tag: string;
  version: string;
  name: string;
  body: string;
  publishedAt: string;
  downloadUrl: string;
  apkSizeMb: number;
  otaBundleUrl?: string;
  otaBundleSizeMb?: number;
}

export const CURRENT_VERSION = packageJson.version || '1.4.3';
const GITHUB_REPO = 'DHNSHYDV/Gita';
const DISMISSED_SESSION_KEY = 'gita_dismissed_update_tag';

// Helper to compare semver versions (e.g. "1.4.3" > "1.4.2")
export function isNewerVersion(latest: string, current: string): boolean {
  const cleanLatest = latest.replace(/^v/, '').trim();
  const cleanCurrent = current.replace(/^v/, '').trim();

  const lParts = cleanLatest.split('.').map(Number);
  const cParts = cleanCurrent.split('.').map(Number);

  for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
    const l = lParts[i] || 0;
    const c = cParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

// Check for updates from GitHub Releases API
export async function checkForUpdate(): Promise<AppRelease | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) return null;
    const release = await res.json();
    const latestTag = release.tag_name || '';
    const cleanVersion = latestTag.replace(/^v/, '');

    if (!isNewerVersion(cleanVersion, CURRENT_VERSION)) {
      return null;
    }

    // Find the release APK asset & OTA web bundle (dist.zip)
    let downloadUrl = `https://github.com/DHNSHYDV/Gita/releases/download/${latestTag}/gita-${latestTag}-release.apk`;
    let apkSizeMb = 7.3;
    let otaBundleUrl: string | undefined;
    let otaBundleSizeMb: number | undefined;

    if (Array.isArray(release.assets)) {
      const apkAsset = release.assets.find((a: { name?: string; browser_download_url?: string; size?: number }) => 
        a.name && a.name.endsWith('.apk')
      );
      if (apkAsset) {
        if (apkAsset.browser_download_url) {
          downloadUrl = apkAsset.browser_download_url;
        }
        if (apkAsset.size) {
          apkSizeMb = Math.round((apkAsset.size / (1024 * 1024)) * 10) / 10;
        }
      }

      const zipAsset = release.assets.find((a: { name?: string; browser_download_url?: string; size?: number }) =>
        a.name && (a.name === 'dist.zip' || a.name.endsWith('.zip'))
      );
      if (zipAsset) {
        otaBundleUrl = zipAsset.browser_download_url;
        if (zipAsset.size) {
          otaBundleSizeMb = Math.round((zipAsset.size / (1024 * 1024)) * 10) / 10;
        }
      }
    }

    const appRelease: AppRelease = {
      tag: latestTag,
      version: cleanVersion,
      name: release.name || `Gita ${latestTag}`,
      body: release.body || 'A new update is available with performance improvements and authentic teachings.',
      publishedAt: release.published_at || new Date().toISOString(),
      downloadUrl,
      apkSizeMb,
      otaBundleUrl,
      otaBundleSizeMb,
    };

    return appRelease;
  } catch {
    return null;
  }
}

// Check if current session dismissed this update
export function isUpdateDismissedThisSession(tag: string): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(DISMISSED_SESSION_KEY) === tag;
}

// Dismiss update for the current session
export function dismissUpdateForSession(tag: string): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(DISMISSED_SESSION_KEY, tag);
}

// Download and install update APK directly from GitHub Releases
export function downloadAndInstallUpdate(downloadUrl: string): void {
  try {
    if (Capacitor.isNativePlatform()) {
      // In Capacitor native Android, opening with _system hands off to Android Download Manager
      window.open(downloadUrl, '_system');
    } else {
      // In web browser, trigger direct file download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = downloadUrl.split('/').pop() || 'gita-update.apk';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch {
    window.location.href = downloadUrl;
  }
}

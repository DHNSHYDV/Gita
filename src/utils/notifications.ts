import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Language } from '../types';
import { getVerse } from '../data/verses';

// Curated 14 Landmark Morning Wisdom Verses for daily rotation
const MORNING_WISDOM_VERSES: Array<{ chapter: number; verse: number }> = [
  { chapter: 2, verse: 47 },
  { chapter: 4, verse: 7 },
  { chapter: 6, verse: 5 },
  { chapter: 9, verse: 22 },
  { chapter: 12, verse: 13 },
  { chapter: 18, verse: 66 },
  { chapter: 2, verse: 14 },
  { chapter: 2, verse: 20 },
  { chapter: 3, verse: 19 },
  { chapter: 6, verse: 6 },
  { chapter: 7, verse: 7 },
  { chapter: 10, verse: 8 },
  { chapter: 15, verse: 15 },
  { chapter: 18, verse: 78 },
];

const MORNING_TITLES: Record<Language, string> = {
  te: '🕉️ ఉదయకాల గీతామృతం',
  hi: '🕉️ प्रातःकालीन गीता अमृत',
  ta: '🕉️ காலை கீதை ஞானம்',
  kn: '🕉️ ಪ್ರಾತಃಕಾಲದ ಗೀತಾಮೃತ',
  en: '🕉️ Morning Gita Wisdom',
};

// Base notification ID range for daily morning quotes (1001 to 1014)
const NOTIFICATION_BASE_ID = 1000;

/**
 * Schedule daily morning notifications for the next 7 days at 6:30 AM.
 * Uses rotating sacred verses with translations in the user's preferred language.
 */
export async function scheduleDailyMorningQuotes(
  language: Language,
  enabled: boolean = true
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // 1. If disabled by user, cancel all scheduled morning notifications
    if (!enabled) {
      const cancelList = Array.from({ length: 14 }, (_, i) => ({
        id: NOTIFICATION_BASE_ID + i + 1,
      }));
      await LocalNotifications.cancel({ notifications: cancelList });
      console.log('🕉️ [Notifications] Daily morning reminders cancelled as requested.');
      return;
    }

    // 2. Check notification permissions (prompt at most once)
    const permStatus = await LocalNotifications.checkPermissions();
    if (permStatus.display === 'granted') {
      localStorage.setItem('gita_notif_perm_granted', 'true');
    } else {
      const alreadyPrompted = localStorage.getItem('gita_notif_perm_prompted');
      if (alreadyPrompted) {
        // Already asked once and not granted; do not prompt again repeatedly
        return;
      }
      localStorage.setItem('gita_notif_perm_prompted', 'true');
      const requestStatus = await LocalNotifications.requestPermissions();
      if (requestStatus.display === 'granted') {
        localStorage.setItem('gita_notif_perm_granted', 'true');
      } else {
        console.warn('⚠️ [Notifications] Notification permission not granted by user.');
        return;
      }
    }

    // 3. Clear previously scheduled morning quotes to prevent duplicates
    const cancelList = Array.from({ length: 14 }, (_, i) => ({
      id: NOTIFICATION_BASE_ID + i + 1,
    }));
    try {
      await LocalNotifications.cancel({ notifications: cancelList });
    } catch {
      // Ignore if none were pending
    }

    // 4. Calculate schedule for the upcoming 7 days at 6:30 AM
    const now = new Date();
    const notificationsToSchedule = [];

    // Use day of year to determine consistent rotating index
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const currentDayOfYear = Math.floor(diff / oneDay);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + dayOffset);
      targetDate.setHours(6, 30, 0, 0); // 6:30 AM local time

      // If today is already past 6:30 AM, skip day 0 and schedule starting tomorrow
      if (dayOffset === 0 && targetDate.getTime() <= now.getTime()) {
        continue;
      }

      const verseIndex = (currentDayOfYear + dayOffset) % MORNING_WISDOM_VERSES.length;
      const ref = MORNING_WISDOM_VERSES[verseIndex];
      const verseData = getVerse(ref.chapter, ref.verse);
      const translationData = verseData.translations[language] || verseData.translations.en;

      const titlePrefix = MORNING_TITLES[language] || MORNING_TITLES.en;
      const title = `${titlePrefix} • ${ref.chapter}.${ref.verse}`;

      // Clean, truncated quote snippet
      let bodyText = translationData.translation.replace(/\n+/g, ' ').trim();
      if (bodyText.length > 130) {
        bodyText = bodyText.substring(0, 127) + '...';
      }

      notificationsToSchedule.push({
        id: NOTIFICATION_BASE_ID + dayOffset + 1,
        title,
        body: `"${bodyText}"`,
        schedule: {
          at: targetDate,
          allowWhileIdle: true,
        },
        sound: undefined,
        extra: {
          type: 'daily_wisdom',
          chapter: ref.chapter,
          verse: ref.verse,
        },
      });
    }

    if (notificationsToSchedule.length > 0) {
      await LocalNotifications.schedule({
        notifications: notificationsToSchedule,
      });
      console.log(
        `🕉️ [Notifications] Scheduled ${notificationsToSchedule.length} daily morning quotes at 6:30 AM.`
      );
    }
  } catch (err) {
    console.warn('⚠️ [Notifications] Error scheduling daily morning quotes:', err);
  }
}

/**
 * Register click listener to navigate to the daily shloka when notification is tapped.
 */
export function registerNotificationClickListener(
  onOpenVerse: (chapter: number, verse: number) => void
): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  try {
    const listenerPromise = LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        const extra = notificationAction.notification.extra;
        if (extra && extra.type === 'daily_wisdom' && extra.chapter && extra.verse) {
          console.log(`🕉️ [Notifications] Tapped daily quote: Ch ${extra.chapter}.${extra.verse}`);
          onOpenVerse(Number(extra.chapter), Number(extra.verse));
        }
      }
    );

    return () => {
      listenerPromise.then((l) => l.remove()).catch(() => {});
    };
  } catch {
    return () => {};
  }
}

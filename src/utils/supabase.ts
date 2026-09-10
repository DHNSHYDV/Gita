import { createClient, type User, type Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export const SUPABASE_URL = 'https://wjhdjihaddpqydmfmzxa.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_PCoa00Qsg_lA-hFMbUVivw_sd6ZGUkC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  email?: string | null;
  username: string;
  avatar_url?: string | null;
  streak?: number;
  last_read?: { chapter: number; verse: number };
  updated_at?: string;
}

// 1. Sign In With Google OAuth
export async function signInWithGoogle(): Promise<{ error: Error | null; url?: string }> {
  try {
    const redirectUri = Capacitor.isNativePlatform()
      ? 'com.gita.wisdom://login-callback'
      : window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: Capacitor.isNativePlatform(),
      },
    });

    if (error) {
      return { error };
    }

    if (Capacitor.isNativePlatform() && data?.url) {
      // In native Android, open using Capacitor Browser Custom Tabs
      await Browser.open({ url: data.url, windowName: '_system' });
      return { error: null, url: data.url };
    }

    return { error: null, url: data?.url };
  } catch (err: unknown) {
    return { error: err as Error };
  }
}

// Handle Deep Link OAuth callback from Android com.gita.wisdom://login-callback
export async function handleAuthCallback(urlStr: string): Promise<{ session: Session | null; error: Error | null }> {
  try {
    // Close Custom Tab if open
    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.close();
      } catch {
        // Browser was already closed or not opened
      }
    }

    // 1. Check if URL has PKCE code parameter
    // e.g. com.gita.wisdom://login-callback?code=xxx
    const urlObj = new URL(urlStr.replace('#', '?'));
    const code = urlObj.searchParams.get('code');
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return { session: null, error };
      return { session: data.session, error: null };
    }

    // 2. Check if URL has hash fragments with access_token & refresh_token
    // e.g. com.gita.wisdom://login-callback#access_token=...&refresh_token=...
    const hashIndex = urlStr.indexOf('#');
    if (hashIndex !== -1) {
      const hash = urlStr.substring(hashIndex + 1);
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) return { session: null, error };
        return { session: data.session, error: null };
      }
    }

    // 3. Fallback: check getSession
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (err) {
    return { session: null, error: err as Error };
  }
}

// 2. Fetch User Profile from Supabase
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile from Supabase:', error);
      return null;
    }

    return data as UserProfile | null;
  } catch (err) {
    console.warn('Exception fetching profile:', err);
    return null;
  }
}

// 3. Upsert User Profile to Supabase
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving profile to Supabase:', error);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Exception saving profile:', err);
    return { success: false, error: err as Error };
  }
}

// 4. Sign Out
export async function signOutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Error signing out:', err);
  }
}

// 5. Get current active user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// 6. Real-time Leaderboard from Supabase Profiles
export interface RealLeaderboardDevotee {
  id: string;
  rank: number;
  name: string;
  streakDays: number;
  points: number;
  avatarUrl?: string | null;
  isCurrentUser?: boolean;
}

export async function fetchLeaderboard(): Promise<RealLeaderboardDevotee[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, streak, last_read, updated_at')
      .order('streak', { ascending: false })
      .limit(50);

    if (error || !data) {
      console.warn('Leaderboard query warning:', error);
      return [];
    }

    const devotees = data.map((item) => {
      const lr = (item.last_read || {}) as Record<string, unknown>;
      const streak = typeof item.streak === 'number' ? item.streak : 1;
      const listened = Array.isArray(lr.listened_verses) ? lr.listened_verses.length : 0;
      const storedPoints = typeof lr.points === 'number' ? lr.points : (listened + streak * 5);

      return {
        id: item.id,
        rank: 0,
        name: item.username || 'Devotee',
        streakDays: streak,
        points: storedPoints,
        avatarUrl: item.avatar_url,
      };
    });

    // Rank primarily by Points DESC, secondarily by Streak DESC
    devotees.sort((a, b) => b.points - a.points || b.streakDays - a.streakDays);

    return devotees.map((d, index) => ({
      ...d,
      rank: index + 1,
    }));
  } catch (err) {
    console.warn('Error fetching leaderboard:', err);
    return [];
  }
}

// 7. Real-time Count of Registered Devotees
export async function fetchRegisteredDevoteeCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error || typeof count !== 'number') {
      return 1;
    }
    return count;
  } catch {
    return 1;
  }
}

// 8. Sync Devotee Progress (Streak, Last Read, Bookmarks, Points & Listened Verses)
export async function syncDevoteeProgress(params: {
  streak?: number;
  lastRead?: { chapter: number; verse: number };
  bookmarks?: string[];
  points?: number;
  listenedVerses?: string[];
}): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch existing profile last_read so we merge instead of overwriting
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('last_read')
      .eq('id', user.id)
      .maybeSingle();

    const existingLastRead = (currentProfile?.last_read || {}) as Record<string, unknown>;

    const updatedLastRead: Record<string, unknown> = {
      ...existingLastRead,
      ...(params.lastRead ? { chapter: params.lastRead.chapter, verse: params.lastRead.verse } : {}),
      ...(params.bookmarks ? { bookmarks: params.bookmarks } : {}),
      ...(params.listenedVerses ? { listened_verses: params.listenedVerses } : {}),
      ...(typeof params.points === 'number' ? { points: params.points } : {}),
    };

    const payload: Record<string, unknown> = {
      id: user.id,
      updated_at: new Date().toISOString(),
      last_read: updatedLastRead,
    };

    if (typeof params.streak === 'number') {
      payload.streak = params.streak;
    }

    await supabase.from('profiles').upsert(payload);
  } catch (err) {
    console.warn('Progress sync warning:', err);
  }
}

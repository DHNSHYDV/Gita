import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingLanguage } from './screens/OnboardingLanguage';
import { OnboardingUsername } from './screens/OnboardingUsername';
import { OnboardingAuth } from './screens/OnboardingAuth';
import { OnboardingSuccess } from './screens/OnboardingSuccess';
import { HomeScreen } from './screens/HomeScreen';
import { ChapterListScreen } from './screens/ChapterListScreen';
import { ShlokaScreen } from './screens/ShlokaScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BookmarksScreen } from './screens/BookmarksScreen';
import { DevoteeStreaksScreen } from './screens/DevoteeStreaksScreen';
import { MoreScreen } from './screens/MoreScreen';
import { DailyVerseModal } from './screens/DailyVerseModal';
import { UpdateModal } from './components/UpdateModal';
import { registerHardwareBackListener } from './utils/native';
import { registerNotificationClickListener } from './utils/notifications';
import { requestAppStartupPermissions } from './utils/permissions';
import { App as CapApp } from '@capacitor/app';
import { handleAuthCallback, fetchUserProfile } from './utils/supabase';
import { LaunchOrchestrator } from './components/LaunchOrchestrator';

import { motion, AnimatePresence, type Variants } from 'framer-motion';

const screenVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 14 : -14,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -14 : 14,
    opacity: 0,
    transition: {
      duration: 0.16,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

export const AppContent: React.FC = () => {
  const {
    currentScreen,
    goBack,
    screenDirection,
    setUserName,
    setIsGoogleLinked,
    setOnboardingCompleted,
    setCurrentScreen,
    navigateToShloka,
    toastMessage,
    showToast,
  } = useApp();

  // Request Notifications & File Access on App Launch
  useEffect(() => {
    requestAppStartupPermissions();
  }, []);

  // Register Android Hardware Back Button & Edge Swipe Gesture Listener
  useEffect(() => {
    const unregister = registerHardwareBackListener(goBack, showToast);
    return () => {
      unregister();
    };
  }, [goBack]);

  // Listen to daily early morning wisdom notification clicks to open verse
  useEffect(() => {
    const unregister = registerNotificationClickListener((chapter, verse) => {
      navigateToShloka(chapter, verse);
    });
    return () => {
      unregister();
    };
  }, [navigateToShloka]);

  // Deep Linking Handler for Mobile OAuth (com.gita.wisdom://login-callback)
  useEffect(() => {
    const handleAppUrl = async ({ url }: { url: string }) => {
      if (url && (url.includes('login-callback') || url.includes('access_token') || url.includes('code='))) {
        try {
          const { session } = await handleAuthCallback(url);
          if (session?.user) {
            setIsGoogleLinked(true);
            const profile = await fetchUserProfile(session.user.id);
            if (profile?.username) {
              // Returning user with existing username
              setUserName(profile.username);
              setOnboardingCompleted(true);
              setCurrentScreen('onboarding-success');
            } else {
              // First time user: route to enter username
              const suggestedName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || '';
              if (suggestedName) {
                setUserName(suggestedName);
              }
              setCurrentScreen('onboarding-username');
            }
          }
        } catch (err) {
          console.error('Deep link auth processing error:', err);
        }
      }
    };

    const listenerPromise = CapApp.addListener('appUrlOpen', handleAppUrl);
    return () => {
      listenerPromise.then(l => l.remove()).catch(() => {});
    };
  }, [setIsGoogleLinked, setUserName, setOnboardingCompleted, setCurrentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'onboarding-language':
        return <OnboardingLanguage />;
      case 'onboarding-username':
        return <OnboardingUsername />;
      case 'onboarding-auth':
        return <OnboardingAuth />;
      case 'onboarding-success':
        return <OnboardingSuccess />;
      case 'home':
        return <HomeScreen />;
      case 'chapters':
        return <ChapterListScreen />;
      case 'shloka':
        return <ShlokaScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'bookmarks':
        return <BookmarksScreen />;
      case 'streaks':
        return <DevoteeStreaksScreen />;
      case 'more':
        return <MoreScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // Screens that display the bottom 5-tab navigation
  const showBottomNav = ['home', 'chapters', 'streaks', 'bookmarks', 'more'].includes(currentScreen);

  return (
    <MobileFrame>
      <AnimatePresence mode="wait" custom={screenDirection}>
        <motion.div
          key={currentScreen}
          custom={screenDirection}
          variants={screenVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full min-h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
      <DailyVerseModal />
      <UpdateModal />
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2A241E]/95 dark:bg-[#FAF7F2]/95 text-white dark:text-[#1F1912] text-xs font-semibold shadow-2xl backdrop-blur-md pointer-events-none tracking-wide"
        >
          {toastMessage}
        </motion.div>
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <LaunchOrchestrator>
      <AppContent />
    </LaunchOrchestrator>
  );
}

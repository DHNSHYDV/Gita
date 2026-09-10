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
import { registerHardwareBackListener } from './utils/native';

export const AppContent: React.FC = () => {
  const { currentScreen, goBack } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  // Register Android Hardware Back Button & Edge Swipe Gesture Listener
  useEffect(() => {
    const unregister = registerHardwareBackListener(goBack, showToast);
    return () => {
      unregister();
    };
  }, [goBack]);

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

  // Screens that display the bottom 4-tab navigation
  const showBottomNav = ['home', 'chapters', 'streaks', 'bookmarks', 'more'].includes(currentScreen);

  return (
    <MobileFrame>
      {renderScreen()}
      {showBottomNav && <BottomNav />}
      <DailyVerseModal />
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2A241E]/95 dark:bg-[#FAF7F2]/95 text-white dark:text-[#1F1912] text-xs font-semibold shadow-2xl backdrop-blur-md animate-fadeIn pointer-events-none tracking-wide">
          {toastMessage}
        </div>
      )}
    </MobileFrame>
  );
};

export default function App() {
  return <AppContent />;
}

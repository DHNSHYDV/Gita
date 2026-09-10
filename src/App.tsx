import React from 'react';
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

export const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

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
    </MobileFrame>
  );
};

export default function App() {
  return <AppContent />;
}

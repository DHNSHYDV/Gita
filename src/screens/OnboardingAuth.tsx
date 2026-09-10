import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Cloud, Smartphone, Users, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle, fetchUserProfile, supabase } from '../utils/supabase';

export const OnboardingAuth: React.FC = () => {
  const { setUserName, setIsGoogleLinked, setOnboardingCompleted, setCurrentScreen } = useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if session became active (e.g. returning from Google OAuth redirect)
  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setLoading(true);
        const profile = await fetchUserProfile(session.user.id);
        setIsGoogleLinked(true);

        if (profile?.username) {
          // Returning User with existing username!
          setUserName(profile.username);
          setOnboardingCompleted(true);
          setCurrentScreen('onboarding-success');
        } else {
          // First-time user without username yet
          const suggestedName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || '';
          if (suggestedName) {
            setUserName(suggestedName);
          }
          setCurrentScreen('onboarding-username');
        }
        setLoading(false);
      }
    };

    handleAuthRedirect();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setLoading(true);
        const profile = await fetchUserProfile(session.user.id);
        setIsGoogleLinked(true);

        if (profile?.username) {
          setUserName(profile.username);
          setOnboardingCompleted(true);
          setCurrentScreen('onboarding-success');
        } else {
          const suggestedName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || '';
          if (suggestedName) {
            setUserName(suggestedName);
          }
          setCurrentScreen('onboarding-username');
        }
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setIsGoogleLinked, setOnboardingCompleted, setCurrentScreen, setUserName]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.warn('Google sign in issue:', error);
        setErrorMessage(error.message || 'Unable to sign in with Google. You can skip and continue.');
        setLoading(false);
      }
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Google sign in error:', e);
      setErrorMessage(e.message || 'Sign-in error occurred.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setCurrentScreen('onboarding-username');
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#141210] text-[#2A241E] dark:text-[#E8E0D2] flex flex-col justify-between p-6 select-none transition-colors">
      {/* Top Header */}
      <div>
        <div className="pt-[max(2.75rem,env(safe-area-inset-top,2.75rem))]">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setCurrentScreen('onboarding-language')}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-[#EAE0D0] dark:hover:bg-[#25201A] transition-colors"
          >
            <ChevronLeft className="w-6 h-6 stroke-[1.75] text-[#2A241E] dark:text-[#FAF7F2]" />
          </motion.button>
        </div>

        {/* Sacred Lotus Icon */}
        <div className="flex justify-center mt-4 mb-2 text-[#C59341]">
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M50 20 C45 35 35 50 20 65 C40 68 50 55 50 45 C50 55 60 68 80 65 C65 50 55 35 50 20 Z" />
            <path d="M50 45 C42 60 25 75 10 75 C30 82 48 70 50 58 C52 70 70 82 90 75 C75 75 58 60 50 45 Z" />
            <path d="M35 75 C45 85 55 85 65 75" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center px-4">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2A2319] dark:text-[#FAF7F2] tracking-tight">
            Preserve Your Sacred Progress
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-[#7E7363] dark:text-[#A89D8C] leading-relaxed">
            Sync your bookmarks, streaks and spiritual journey securely in the cloud.
          </p>
        </div>

        {/* Google Sign-in Button */}
        <div className="mt-7 max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-[#1E1914] border border-[#DDD3C2] dark:border-[#382F24] hover:bg-[#FDFBF7] dark:hover:bg-[#26201A] shadow-xs flex items-center justify-center gap-3 transition-all disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-[#C59341] animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="font-semibold text-sm text-[#3C3224] dark:text-[#E8DAC2]">
              {loading ? 'Connecting with Google...' : 'Continue with Google'}
            </span>
          </motion.button>

          {errorMessage && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 text-center mt-2 px-2">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Benefits Checklist */}
        <div className="mt-8 space-y-4 px-2 max-w-sm mx-auto">
          <div className="flex items-center gap-3.5 text-xs text-[#524534] dark:text-[#C5B7A4]">
            <div className="w-8 h-8 rounded-full bg-[#EFE6D8] dark:bg-[#282117] flex items-center justify-center text-[#C59341] dark:text-[#E8C581] flex-shrink-0">
              <Cloud className="w-4 h-4 stroke-[1.75]" />
            </div>
            <span className="font-medium">Continuous cloud backup for your streak</span>
          </div>

          <div className="flex items-center gap-3.5 text-xs text-[#524534] dark:text-[#C5B7A4]">
            <div className="w-8 h-8 rounded-full bg-[#EFE6D8] dark:bg-[#282117] flex items-center justify-center text-[#C59341] dark:text-[#E8C581] flex-shrink-0">
              <Smartphone className="w-4 h-4 stroke-[1.75]" />
            </div>
            <span className="font-medium">Seamless reading experience across devices</span>
          </div>

          <div className="flex items-center gap-3.5 text-xs text-[#524534] dark:text-[#C5B7A4]">
            <div className="w-8 h-8 rounded-full bg-[#EFE6D8] dark:bg-[#282117] flex items-center justify-center text-[#C59341] dark:text-[#E8C581] flex-shrink-0">
              <Users className="w-4 h-4 stroke-[1.75]" />
            </div>
            <span className="font-medium">Participate in the global Sadhana Circle</span>
          </div>
        </div>
      </div>

      {/* Bottom Skip Section */}
      <div className="pt-6 pb-6 text-center">
        <p className="text-xs text-[#8C806F] dark:text-[#9B8F7E]">
          You can always link your account later in More
        </p>
        <button
          onClick={handleSkip}
          className="mt-1.5 text-xs font-semibold text-[#8C6D3F] dark:text-[#E8C581] underline hover:text-[#2A241E] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

import { useState, lazy, Suspense, useEffect } from 'react'
import ChandrashtamCalculator from './components/ChandrashtamCalculator'
import NakshatraInfo from './components/NakshatraInfo'
import PanchangDetails from './components/PanchangDetails'
import { NotificationSettings } from './components/NotificationSettingsNoHover'
import { LocationRashiBar } from './components/LocationRashiBar'
import WelcomeBanner from './components/WelcomeBanner'
import OfflineIndicator from './components/OfflineIndicator'
import InstallPrompt from './components/InstallPrompt'
import IOSInstallPrompt from './components/IOSInstallPrompt'
import InstallButton from './components/InstallButton'
import { useReducedMotion } from './hooks/useReducedMotion'
import ErrorBoundary from './components/ErrorBoundary'
import { calculateMoonPosition } from './lib/astro-calculator'
import { RASHI_ORDER } from './lib/vedic-constants'
import { Sparkles, Heart, Home, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import CosmicLoader from './components/CosmicLoader'
import SimplifiedLandingPage from './components/SimplifiedLandingPage'
import { trackPageView, trackEvent } from './services/analytics'

// Lazy load Annual Calendar (only loads when scrolled into view)
const ChandrashtamAnnualView = lazy(() => import('./components/ChandrashtamAnnualView'))

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [view, setView] = useState(() => {
    // Check if user has a preference stored
    const savedView = localStorage.getItem('preferredView');
    return savedView || 'simplified'; // Default to simplified view
  });
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' };
  });
  const [currentMoonRashi, setCurrentMoonRashi] = useState('');

  // Get current moon position for status card
  useEffect(() => {
    const updateMoonRashi = () => {
      const moonPos = calculateMoonPosition();
      if (moonPos) {
        setCurrentMoonRashi(RASHI_ORDER[moonPos.rashi_number]);
      }
    };
    updateMoonRashi();
    const interval = setInterval(updateMoonRashi, 60000);
    return () => clearInterval(interval);
  }, []);

  // Track initial page view
  useEffect(() => {
    const pageTitle = view === 'simplified' ? 'Simplified View' : 'Advanced Dashboard';
    const pagePath = view === 'simplified' ? '/simplified' : '/advanced';
    trackPageView(pagePath, pageTitle);
  }, [view]);

  const handleShowAdvanced = () => {
    setView('advanced');
    localStorage.setItem('preferredView', 'advanced');
    trackPageView('/advanced', 'Advanced Dashboard');
    trackEvent('Navigation', 'view_changed', 'advanced');
  };

  const handleShowSimplified = () => {
    setView('simplified');
    localStorage.setItem('preferredView', 'simplified');
    trackPageView('/simplified', 'Simplified View');
    trackEvent('Navigation', 'view_changed', 'simplified');
  };

  // If simplified view, show the simplified landing page
  if (view === 'simplified') {
    return (
      <>
        <SimplifiedLandingPage onShowAdvanced={handleShowAdvanced} />
        <InstallPrompt />
        <IOSInstallPrompt />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 relative overflow-hidden">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Install Prompt */}
      <InstallPrompt />
      <IOSInstallPrompt />

      {/* View Toggle */}
      <nav role="navigation" aria-label="View navigation">
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: -20 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.6 } : { duration: 0 }}
          className="flex justify-center mb-4"
        >
        <div className="bg-white rounded-full shadow-md p-1 flex gap-1">
          <button
            onClick={handleShowSimplified}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              view === 'simplified'
                ? 'bg-cosmic-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Simple
          </button>
          <button
            onClick={handleShowAdvanced}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              view === 'advanced'
                ? 'bg-cosmic-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Advanced
          </button>
        </div>
      </motion.div>
      </nav>

      {/* Animated background elements */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-cosmic-purple-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-48 h-48 bg-cosmic-blue-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-40 h-40 bg-cosmic-gold-300/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      <main className="container mx-auto max-w-4xl relative z-10">
        <header>
          <motion.div
            initial={!prefersReducedMotion ? { opacity: 0, y: -20 } : {}}
            animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            transition={!prefersReducedMotion ? { duration: 0.6 } : { duration: 0 }}
            className="text-center mb-6 md:mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-cosmic-gold-500 animate-pulse" aria-label="Sparkles icon" role="img" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cosmic-purple-600 via-cosmic-blue-600 to-cosmic-gold-600 bg-clip-text text-transparent">
                Moon Mood
              </h1>
              <Sparkles className="w-8 h-8 text-cosmic-gold-500 animate-pulse" aria-label="Sparkles icon" role="img" />
            </div>
            <p className="text-sm md:text-base text-gray-700 font-medium">
              Vedic Astrology Dashboard
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-cosmic-purple-400 to-transparent" />
              <span className="text-xs text-gray-600">Track cosmic influences on consciousness</span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-cosmic-purple-400 to-transparent" />
            </div>
          </motion.div>
        </header>

        {/* Welcome Banner for First-Time Users */}
        <WelcomeBanner />

        {/* Location & Rashi Selector Bar */}
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.3 } : { duration: 0 }}
          className="mb-6"
        >
          {currentMoonRashi && (
            <LocationRashiBar
              onLocationChange={setCurrentLocation}
              currentMoonRashi={currentMoonRashi}
            />
          )}
        </motion.div>

        <div className="flex flex-col space-y-6">
          {/* Notification Settings */}
          <ErrorBoundary message="Unable to load notification settings. Please refresh the page.">
            <NotificationSettings />
          </ErrorBoundary>

          {/* Live Chandrashtam Calculator */}
          <ErrorBoundary
            title="Calculation Error"
            message="Unable to calculate Chandrashtam positions. Please check your internet connection and try again."
          >
            <ChandrashtamCalculator />
          </ErrorBoundary>

          {/* Panchang and Nakshatra Info */}
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            <ErrorBoundary message="Unable to load Panchang details.">
              <PanchangDetails location={currentLocation} />
            </ErrorBoundary>
            <ErrorBoundary message="Unable to load Nakshatra information.">
              <NakshatraInfo />
            </ErrorBoundary>
          </div>

          {/* Annual Chandrashtam Calendar */}
          <div id="annual-calendar">
            <ErrorBoundary message="Unable to load annual calendar data.">
              <Suspense fallback={<CosmicLoader text="Loading calendar..." size={50} />}>
                <ChandrashtamAnnualView year={2025} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={!prefersReducedMotion ? { opacity: 0 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1 } : {}}
          transition={!prefersReducedMotion ? { delay: 1, duration: 0.5 } : { duration: 0 }}
          className="mt-12 text-center text-xs text-gray-600"
        >
          <div className="flex justify-center mb-3">
            <InstallButton />
          </div>
          <p>Calculations based on Vedic sidereal zodiac • Updates every minute</p>
          <p className="mt-1">Timings are approximate and for reference only</p>
          <p className="mt-3 flex items-center justify-center gap-1">
            Made with
            <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" aria-label="Heart icon" />
            by
            <a
              href="https://mihirchavan.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmic-purple-600 hover:text-cosmic-purple-700 font-medium transition-colors"
            >
              Hokage Mihir
            </a>
          </p>
        </motion.footer>
      </main>
    </div>
  )
}

export default App
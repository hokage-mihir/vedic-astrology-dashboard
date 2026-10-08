import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BarChart3 } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import SimpleLocationRashiBar from './SimpleLocationRashiBar';
import PersonalStatusCard from './PersonalStatusCard';
import RahuKalamCard from './RahuKalamCard';
import WelcomeBanner from './WelcomeBanner';
import ErrorBoundary from './ErrorBoundary';
import { useLocationContext } from '../contexts/LocationContext';
import PropTypes from 'prop-types';

export function SimplifiedLandingPage({ onShowAdvanced }) {
  const prefersReducedMotion = useReducedMotion();
  const { currentLocation, selectedRashi, updateLocation, updateRashi } = useLocationContext();

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: -20 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.6 } : { duration: 0 }}
        className="text-center mb-4 sm:mb-6 md:mb-8"
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-cosmic-gold-500 animate-pulse" aria-label="Sparkles icon" role="img" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cosmic-purple-600 via-cosmic-blue-600 to-cosmic-gold-600 bg-clip-text text-transparent">
            Moon Mood
          </h1>
          <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-cosmic-gold-500 animate-pulse" aria-label="Sparkles icon" role="img" />
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium px-2">
          Vedic Astrology Dashboard
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-cosmic-purple-400 to-transparent" />
          <span className="text-xs text-gray-600">Personal Chandrashtam Status</span>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-cosmic-purple-400 to-transparent" />
        </div>
      </motion.div>

      {/* Welcome Banner */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.2 } : { duration: 0 }}
        className="mb-4 sm:mb-6"
      >
        <WelcomeBanner />
      </motion.div>

      {/* Location & Rashi Selector */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.3 } : { duration: 0 }}
        className="mb-4 sm:mb-6"
      >
        <ErrorBoundary message="Unable to load location selector. Please refresh the page.">
          <SimpleLocationRashiBar 
            onLocationChange={updateLocation}
            onRashiChange={updateRashi}
            currentLocation={currentLocation}
            currentRashi={selectedRashi}
          />
        </ErrorBoundary>
      </motion.div>

      {/* Main Status Cards */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Personal Status Card */}
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.4 } : { duration: 0 }}
        >
          <ErrorBoundary message="Unable to load your Chandrashtam status. Please refresh the page.">
            <PersonalStatusCard
              userRashi={selectedRashi}
              compact={true}
              defaultExpanded={false}
            />
          </ErrorBoundary>
        </motion.div>

        {/* Rahu Kalam Card */}
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.5 } : { duration: 0 }}
        >
          <ErrorBoundary message="Unable to load Rahu Kalam timing. Please refresh the page.">
            <RahuKalamCard
              location={currentLocation}
              compact={true}
              defaultExpanded={false}
            />
          </ErrorBoundary>
        </motion.div>
      </div>

      {/* Advanced View Toggle */}
      <motion.div
        initial={!prefersReducedMotion ? { opacity: 0 } : {}}
        animate={!prefersReducedMotion ? { opacity: 1 } : {}}
        transition={!prefersReducedMotion ? { delay: 0.6, duration: 0.5 } : { duration: 0 }}
        className="mt-6 sm:mt-8 text-center"
      >
        <button
          onClick={onShowAdvanced}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:from-cosmic-purple-700 hover:to-cosmic-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          View Full Dashboard
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <p className="text-xs text-gray-600 mt-2 px-4">
          Access detailed calculations, annual calendar, and advanced features
        </p>
      </motion.div>
    </div>
  );
}

SimplifiedLandingPage.propTypes = {
  onShowAdvanced: PropTypes.func.isRequired,
};

export default SimplifiedLandingPage;

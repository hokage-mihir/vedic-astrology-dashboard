import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BarChart3 } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import SimpleLocationRashiBar from './SimpleLocationRashiBar';
import PersonalStatusCard from './PersonalStatusCard';
import RahuKalamCard from './RahuKalamCard';
import WelcomeBanner from './WelcomeBanner';
import OfflineIndicator from './OfflineIndicator';
import ErrorBoundary from './ErrorBoundary';
import InstallButton from './InstallButton';

export function SimplifiedLandingPage({ onShowAdvanced }) {
  const prefersReducedMotion = useReducedMotion();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedRashi, setSelectedRashi] = useState('');

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
  };

  const handleRashiChange = (rashi) => {
    setSelectedRashi(rashi);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Offline Indicator */}
      <OfflineIndicator />

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

      <div className="container mx-auto max-w-3xl lg:max-w-4xl relative z-10 px-2 sm:px-4">
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
              onLocationChange={handleLocationChange}
              onRashiChange={handleRashiChange}
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
                location={currentLocation}
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

        {/* Footer */}
        <motion.footer
          initial={!prefersReducedMotion ? { opacity: 0 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1 } : {}}
          transition={!prefersReducedMotion ? { delay: 1, duration: 0.5 } : { duration: 0 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center text-xs text-gray-600 px-4"
        >
          <div className="flex justify-center mb-3">
            <InstallButton />
          </div>
          <p className="leading-relaxed">Calculations based on Vedic sidereal zodiac • Updates every minute</p>
          <p className="mt-1 leading-relaxed">Timings are approximate and for reference only</p>
          <p className="mt-2 sm:mt-3 flex flex-wrap items-center justify-center gap-1">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <a
              href="https://mihirchavan.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cosmic-purple-600 hover:text-cosmic-purple-700 font-medium transition-colors"
            >
              Hokage Mihir
            </a>
          </p>
          <p className="mt-2 text-[10px] text-gray-400">v1.2.0-compact-selectors</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default SimplifiedLandingPage;
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import ChandrashtamCalculator from '../components/ChandrashtamCalculator';
import NakshatraInfo from '../components/NakshatraInfo';
import PanchangDetails from '../components/PanchangDetails';
import { NotificationSettings } from '../components/NotificationSettingsNoHover';
import { LocationRashiBar } from '../components/LocationRashiBar';
import WelcomeBanner from '../components/WelcomeBanner';
import ErrorBoundary from '../components/ErrorBoundary';
import CosmicLoader from '../components/CosmicLoader';
import { calculateMoonPosition } from '../lib/astro-calculator';
import { RASHI_ORDER } from '../lib/vedic-constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { trackPageView } from '../services/analytics';
import { useLocationContext } from '../contexts/LocationContext';

// Lazy load Annual Calendar
const ChandrashtamAnnualView = lazy(() => import('../components/ChandrashtamAnnualView'));

const AdvancedPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const { currentLocation, selectedRashi, updateLocation, updateRashi } = useLocationContext();
  
  const [currentMoonRashi, setCurrentMoonRashi] = useState('');

  // Track page view
  useEffect(() => {
    trackPageView('/advanced', 'Advanced Dashboard');
  }, []);

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

  return (
    <>
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
            onLocationChange={updateLocation}
            onRashiChange={updateRashi}
            currentLocation={currentLocation}
            currentRashi={selectedRashi}
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
              <ChandrashtamAnnualView 
                year={2025} 
                userRashi={selectedRashi}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
};

export default AdvancedPage;

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ImprovedTooltip } from "../components/ui/improved-tooltip";
import { calculateMoonPosition } from '../lib/astro-calculator';
import { RASHI_ORDER, CHANDRASHTAM_MAP, getNextRashi } from '../lib/vedic-constants';
import { RASHI_SYMBOLS } from '../lib/rashi-symbols';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useNotifications } from '../contexts/NotificationContext';
import { Moon, AlertTriangle, Clock, Sparkles, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicLoader from './CosmicLoader';
import ProgressRing from './ProgressRing';
import MoonPhase from './MoonPhase';

const ChandrashtamCalculator = () => {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const prefersReducedMotion = useReducedMotion();
  const { showNotification, notificationSettings } = useNotifications();
  const previousAfflictedRashi = useRef(null);
  const previousUserRashiStatus = useRef(null); // Track if user's Rashi was afflicted

  // Memoized function to calculate time left in current Rashi
  const calculateTimeLeft = useCallback((degreesInRashi, moonSpeed) => {
    const degreesLeft = 30 - degreesInRashi; // Each Rashi is 30 degrees
    const timeLeftHours = (degreesLeft / moonSpeed) * 24; // Convert to hours

    const days = Math.floor(timeLeftHours / 24);
    const remainingHours = Math.floor(timeLeftHours % 24);
    const minutes = Math.floor((timeLeftHours - Math.floor(timeLeftHours)) * 60);

    if (days === 0) {
      return `${remainingHours}h ${minutes}m`;
    }

    const daysText = days === 1 ? 'day' : 'days';
    return `${days} ${daysText} ${remainingHours}h ${minutes}m`;
  }, []);

  const calculatePositions = useCallback(() => {
    try {
      setLoading(true);

      const moonPos = calculateMoonPosition();
      const currentRashi = RASHI_ORDER[moonPos.rashi_number];

      // Find which Rashi is afflicted when Moon is in current position
      const afflictedRashi = Object.entries(CHANDRASHTAM_MAP).find(
        ([, moonPosition]) => moonPosition === currentRashi
      )?.[0] || null;

      // Calculate next affected Rashi
      const nextMoonRashi = getNextRashi(currentRashi);
      const nextAfflictedRashi = Object.entries(CHANDRASHTAM_MAP).find(
        ([, moonPosition]) => moonPosition === nextMoonRashi
      )?.[0] || null;

      const timeLeft = calculateTimeLeft(moonPos.degrees_in_rashi, moonPos.speed);

      // Get user's selected Rashi from localStorage
      const userMoonRashi = localStorage.getItem('userMoonRashi') || RASHI_ORDER[0];

      // Check if user's Rashi is currently afflicted
      const isUserRashiAfflicted = (afflictedRashi === userMoonRashi);

      // Send personalized notifications only for user's Rashi
      if (previousUserRashiStatus.current !== null &&
          previousUserRashiStatus.current !== isUserRashiAfflicted) {

        if (isUserRashiAfflicted) {
          // User's Rashi just became afflicted
          if (notificationSettings.chandrashtamStart) {
            showNotification({
              title: '⚠️ Your Chandrashtam Started',
              body: `${userMoonRashi} is now experiencing Chandrashtam. Practice awareness and patience during this period.`,
              type: 'warning',
              duration: 10000
            });
          }
        } else {
          // User's Rashi is no longer afflicted
          if (notificationSettings.chandrashtamEnd) {
            showNotification({
              title: '✓ Your Chandrashtam Ended',
              body: `The difficult period has ended for ${userMoonRashi}. Mental clarity returning!`,
              type: 'success',
              duration: 8000
            });
          }
        }
      }

      previousAfflictedRashi.current = afflictedRashi;
      previousUserRashiStatus.current = isUserRashiAfflicted;

      setMoonData({
        current_rashi: currentRashi,
        afflicted_rashi: afflictedRashi,
        next_afflicted_rashi: nextAfflictedRashi,
        degrees_in_rashi: moonPos.degrees_in_rashi,
        time_left: timeLeft
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [calculateTimeLeft, showNotification, notificationSettings]);

  useEffect(() => {
    calculatePositions();
    const interval = setInterval(calculatePositions, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [calculatePositions]);

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
      animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={!prefersReducedMotion ? { duration: 0.5 } : { duration: 0 }}
    >
      <Card className="bg-white border-cosmic-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-cosmic-purple-500" aria-label="Moon icon" role="img" />
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
              Chandrashtam Details
            </CardTitle>
            <ImprovedTooltip term="chandrashtam" />
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-cosmic-purple-50 border-cosmic-purple-200">
            <AlertTriangle className="w-4 h-4 text-cosmic-purple-600" aria-label="Alert icon" role="img" />
            <AlertDescription className="text-sm text-gray-700 ml-6">
              On Chandra Ashtama days, the Moon will induce more negative thoughts in your mind, confuse you, and overall add stress.
              <span className="block mt-2">Just by being aware of these days can save your mind from these negative effects.</span>
              <span className="block mt-2">Check if your Rashi (Moon sign) is currently afflicted. If it is, just relax knowing this is a cosmic game.</span>
            </AlertDescription>
          </Alert>

          {loading && <CosmicLoader text="Calculating celestial positions..." />}

          {moonData && !loading && (
            <motion.div
              className="space-y-6"
              initial={!prefersReducedMotion ? { opacity: 0 } : {}}
              animate={!prefersReducedMotion ? { opacity: 1 } : {}}
              transition={!prefersReducedMotion ? { delay: 0.2 } : { duration: 0 }}
            >
              {/* Decorative separator */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-purple-300 to-transparent" />
                <Sparkles className="w-4 h-4 text-cosmic-gold-500" aria-label="Sparkles icon" role="img" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-purple-300 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-cosmic-purple-50 to-cosmic-blue-50 rounded-lg border border-cosmic-purple-200">
                <motion.div
                  initial={!prefersReducedMotion ? { x: -20, opacity: 0 } : {}}
                  animate={!prefersReducedMotion ? { x: 0, opacity: 1 } : {}}
                  transition={!prefersReducedMotion ? { delay: 0.3 } : { duration: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-5 h-5 text-cosmic-blue-500" aria-label="Moon icon" role="img" />
                    <h3 className="font-semibold text-gray-900">Current Moon Position</h3>
                    <ImprovedTooltip term="rashi" />
                  </div>

                  <p className="text-2xl font-bold text-cosmic-blue-600 mt-2">
                    {RASHI_SYMBOLS[moonData.current_rashi]} {moonData.current_rashi}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {moonData.degrees_in_rashi.toFixed(2)}° in sign
                  </p>

                  {/* Countdown Timer with Progress Ring */}
                  <div className="my-6 flex flex-col items-center">
                    <div className="relative">
                      <ProgressRing
                        progress={(moonData.degrees_in_rashi / 30) * 100}
                        size={140}
                        strokeWidth={10}
                        showLabel={false}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 bg-clip-text text-transparent text-center leading-tight">
                          {moonData.time_left}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 mt-3">
                      <Clock className="w-3 h-3" />
                      <span>until next Rashi</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={!prefersReducedMotion ? { x: 20, opacity: 0 } : {}}
                  animate={!prefersReducedMotion ? { x: 0, opacity: 1 } : {}}
                  transition={!prefersReducedMotion ? { delay: 0.4 } : { duration: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" aria-label="Warning icon" role="img" />
                      <h3 className="font-semibold text-gray-900">Currently Afflicted Rashi</h3>
                      <ImprovedTooltip term="rashi" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {RASHI_SYMBOLS[moonData.afflicted_rashi]} {moonData.afflicted_rashi}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Next Afflicted Rashi</h3>
                    <p className="text-lg font-semibold text-orange-600">
                      {RASHI_SYMBOLS[moonData.next_afflicted_rashi]} {moonData.next_afflicted_rashi}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Link to Annual Calendar */}
              <motion.div
                initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
                animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
                transition={!prefersReducedMotion ? { delay: 0.5 } : { duration: 0 }}
                className="mt-4 text-center"
              >
                <a
                  href="#annual-calendar"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-cosmic-purple-700 bg-cosmic-purple-50 hover:bg-cosmic-purple-100 rounded-lg transition-colors duration-200"
                >
                  <CalendarDays className="w-4 h-4" />
                  View Annual Chandrashtam Calendar
                </a>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(ChandrashtamCalculator);
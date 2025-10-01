import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { InfoTooltip } from "../components/ui/tooltip";
import { calculateMoonPosition, AYANAMSA } from '../lib/astro-calculator';
import { RASHI_ORDER, CHANDRASHTAM_MAP, getNextRashi } from '../lib/vedic-constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Moon, AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicLoader from './CosmicLoader';

const ChandrashtamCalculator = () => {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prefersReducedMotion = useReducedMotion();

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
        ([_rashi, moonPosition]) => moonPosition === currentRashi
      )?.[0] || null;

      // Calculate next affected Rashi
      const nextMoonRashi = getNextRashi(currentRashi);
      const nextAfflictedRashi = Object.entries(CHANDRASHTAM_MAP).find(
        ([_rashi, moonPosition]) => moonPosition === nextMoonRashi
      )?.[0] || null;
      
      const timeLeft = calculateTimeLeft(moonPos.degrees_in_rashi, moonPos.speed);
      
      setMoonData({
        current_rashi: currentRashi,
        afflicted_rashi: afflictedRashi,
        next_afflicted_rashi: nextAfflictedRashi,
        degrees_in_rashi: moonPos.degrees_in_rashi,
        time_left: timeLeft
      });
      
      setError(null);
    } catch (err) {
      setError(`Calculation error: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      <Card className="bg-white dark:bg-gray-800 border-cosmic-purple-200 dark:border-cosmic-purple-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-cosmic-purple-500" aria-label="Moon icon" role="img" />
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Chandrashtam Details
            </CardTitle>
            <InfoTooltip
              content="Chandrashtam occurs when the Moon transits the 8th house from your Moon sign, creating mental and emotional challenges. Awareness helps mitigate negative effects."
              side="right"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-cosmic-purple-50 dark:bg-cosmic-purple-900/20 border-cosmic-purple-200 dark:border-cosmic-purple-800">
            <AlertTriangle className="w-4 h-4 text-cosmic-purple-600 dark:text-cosmic-purple-400" aria-label="Alert icon" role="img" />
            <AlertDescription className="text-sm text-gray-700 dark:text-gray-300 ml-6">
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
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-purple-300 dark:via-cosmic-purple-700 to-transparent" />
                <Sparkles className="w-4 h-4 text-cosmic-gold-500" aria-label="Sparkles icon" role="img" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cosmic-purple-300 dark:via-cosmic-purple-700 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gradient-to-br from-cosmic-purple-50 to-cosmic-blue-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-cosmic-purple-200 dark:border-cosmic-purple-800">
                <motion.div
                  initial={!prefersReducedMotion ? { x: -20, opacity: 0 } : {}}
                  animate={!prefersReducedMotion ? { x: 0, opacity: 1 } : {}}
                  transition={!prefersReducedMotion ? { delay: 0.3 } : { duration: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-5 h-5 text-cosmic-blue-500" aria-label="Moon icon" role="img" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Current Moon Position</h3>
                    <InfoTooltip
                      content="The current sidereal zodiac sign (Rashi) where the Moon is transiting"
                      side="top"
                    />
                  </div>
                  <p className="text-2xl font-bold text-cosmic-blue-600 dark:text-cosmic-blue-400">{moonData.current_rashi}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {moonData.degrees_in_rashi.toFixed(2)}° in sign
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-cosmic-purple-600 dark:text-cosmic-purple-400">
                    <Clock className="w-4 h-4" aria-label="Clock icon" role="img" />
                    <span>Time left: {moonData.time_left}</span>
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">Currently Afflicted Rashi</h3>
                      <InfoTooltip
                        content="The Moon sign experiencing Chandrashtam (8th house affliction) right now"
                        side="top"
                      />
                    </div>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{moonData.afflicted_rashi}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Next Afflicted Rashi</h3>
                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">{moonData.next_afflicted_rashi}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChandrashtamCalculator;
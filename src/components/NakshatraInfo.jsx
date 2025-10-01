import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { InfoTooltip } from "../components/ui/tooltip";
import { calculateMoonPosition } from '../lib/astro-calculator';
import { getNakshatraInfo } from '../lib/vedic-constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Star, Crown, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicLoader from './CosmicLoader';

const NakshatraInfo = () => {
  const [nakshatraInfo, setNakshatraInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateNakshatra = () => {
      try {
        setLoading(true);
        const moonPos = calculateMoonPosition();

        // Validate moon position data
        if (!moonPos || moonPos.longitude === undefined) {
          throw new Error('Unable to calculate moon position');
        }

        setNakshatraInfo(getNakshatraInfo(moonPos.longitude));
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to calculate Nakshatra details');
        console.error('Error updating Nakshatra:', err);
      } finally {
        setLoading(false);
      }
    };

    updateNakshatra();
    const interval = setInterval(updateNakshatra, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
      animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.2 } : { duration: 0 }}
    >
      <Card className="bg-white dark:bg-gray-800 border-cosmic-blue-200 dark:border-cosmic-blue-800 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-cosmic-gold-500" aria-label="Star icon" role="img" />
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Nakshatra Details
            </CardTitle>
            <InfoTooltip
              content="Nakshatras are the 27 lunar mansions in Vedic astrology. Each represents unique cosmic energies and influences."
              side="right"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading && <CosmicLoader text="Loading Nakshatra..." size={50} />}

          {error && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" aria-label="Error icon" role="img" />
              <AlertDescription className="ml-6 text-sm text-red-700 dark:text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {nakshatraInfo && !loading && !error && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4"
              initial={!prefersReducedMotion ? { opacity: 0 } : {}}
              animate={!prefersReducedMotion ? { opacity: 1 } : {}}
              transition={!prefersReducedMotion ? { delay: 0.2 } : { duration: 0 }}
            >
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-cosmic-gold-50 to-cosmic-purple-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-cosmic-gold-200 dark:border-cosmic-gold-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-cosmic-gold-500" aria-label="Sparkles icon" role="img" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Current Nakshatra</h3>
                    <InfoTooltip
                      content="The lunar mansion where the Moon is currently transiting"
                      side="top"
                    />
                  </div>
                  <p className="text-2xl font-bold text-cosmic-gold-600 dark:text-cosmic-gold-400">{nakshatraInfo.name}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Pada (Quarter)</h3>
                    <InfoTooltip
                      content="Each Nakshatra is divided into 4 padas (quarters), representing different sub-energies"
                      side="top"
                    />
                  </div>
                  <p className="text-lg text-cosmic-purple-600 dark:text-cosmic-purple-400 font-semibold">{nakshatraInfo.pada}/4</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-cosmic-purple-500" aria-label="Crown icon" role="img" />
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Ruling Deity</h3>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{nakshatraInfo.deity}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Symbol</h3>
                  <p className="text-gray-800 dark:text-gray-200">{nakshatraInfo.symbol}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Planetary Ruler</h3>
                    <InfoTooltip
                      content="The planet that governs this Nakshatra's energy and influences"
                      side="top"
                    />
                  </div>
                  <p className="text-cosmic-blue-600 dark:text-cosmic-blue-400 font-semibold">{nakshatraInfo.ruler}</p>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Progress: {nakshatraInfo.degrees}° in Nakshatra
                  </p>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cosmic-gold-400 to-cosmic-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(parseFloat(nakshatraInfo.degrees) / 13.33) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NakshatraInfo;
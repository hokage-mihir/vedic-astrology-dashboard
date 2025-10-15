import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const WelcomeBanner = ({ onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    // Auto-expand on first visit
    return !hasSeenWelcome;
  });

  useEffect(() => {
    // Mark as seen after first view
    if (isExpanded) {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="mb-4 sm:mb-6 relative">
      <div className="bg-gradient-to-r from-cosmic-purple-500 to-cosmic-blue-500 rounded-xl text-white shadow-lg relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Sparkles className="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8" />
          <Sparkles className="absolute bottom-2 left-2 w-5 sm:w-6 h-5 sm:h-6" />
        </div>

        {/* Collapsible Header */}
        <button
          onClick={handleToggle}
          className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors relative"
          aria-label={isExpanded ? "Collapse welcome guide" : "Expand welcome guide"}
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">🌙</span>
            <div className="text-left flex-1 min-w-0">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">
                Welcome to Moon Mood!
              </h2>
              {!isExpanded && (
                <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-1">
                  Track when the Moon affects your emotional well-being • Select location & Rashi to get started
                </p>
              )}
              {isExpanded && (
                <p className="text-xs sm:text-sm text-white/80">
                  Quick start guide
                </p>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </motion.div>
        </button>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 relative">
                <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                  Track when the Moon affects your emotional and mental well-being
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                  <p className="font-semibold mb-2 text-xs sm:text-sm md:text-base">
                    👋 First time here? Here's what to do:
                  </p>
                  <ol className="space-y-2 text-xs sm:text-sm md:text-base text-white/90">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-white flex-shrink-0">1.</span>
                      <span>
                        <strong className="text-white">Select your location</strong> 📍 (for accurate timing)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-white flex-shrink-0">2.</span>
                      <span>
                        <strong className="text-white">Choose your Moon sign (Rashi)</strong> 🌙 - Don't know it? Find out (coming soon)!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-white flex-shrink-0">3.</span>
                      <span>
                        Watch the <strong className="text-white">status indicator</strong> - Green = Good time, Red = Be mindful
                      </span>
                    </li>
                  </ol>
                </div>

                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/80 italic">
                  💡 Tip: Hover over any ⓘ icon to learn more about Vedic astrology terms
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

WelcomeBanner.propTypes = {
  onDismiss: PropTypes.func,
};

export default WelcomeBanner;

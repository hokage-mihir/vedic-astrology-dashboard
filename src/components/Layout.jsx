import { motion } from 'framer-motion';
import { Sparkles, Heart, Home, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import OfflineIndicator from './OfflineIndicator';
import InstallButton from './InstallButton';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();

  const isSimplified = location.pathname === '/' || location.pathname === '/simplified';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] relative overflow-hidden">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* View Toggle Navigation */}
      <nav role="navigation" aria-label="View navigation" className="relative z-20">
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: -20 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.6 } : { duration: 0 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-white rounded-full shadow-md p-1 flex gap-1">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isSimplified
                  ? 'bg-cosmic-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Simple
            </button>
            <button
              onClick={() => navigate('/advanced')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                !isSimplified
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
        {/* Header - Only show on Advanced page as Simplified has its own header */}
        {!isSimplified && (
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
        )}

        {children}

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
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

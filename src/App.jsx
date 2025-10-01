import { useState } from 'react'
import ChandrashtamCalculator from './components/ChandrashtamCalculator'
import ChandrashtamAnnualView from './components/ChandrashtamAnnualView'
import NakshatraInfo from './components/NakshatraInfo'
import PanchangDetails from './components/PanchangDetails'
import { NotificationSettings } from './components/NotificationSettings'
import { TimezoneSelector, LOCATIONS } from './components/TimezoneSelector'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('selectedLocation');
    return saved ? JSON.parse(saved) : LOCATIONS[0];
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:bg-cosmic-gradient-dark p-4 relative overflow-hidden">
      {/* Animated background elements */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-cosmic-purple-300/20 dark:bg-cosmic-purple-700/20 rounded-full blur-3xl"
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
            className="absolute top-40 right-20 w-48 h-48 bg-cosmic-blue-300/20 dark:bg-cosmic-blue-700/20 rounded-full blur-3xl"
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
            className="absolute bottom-20 left-1/3 w-40 h-40 bg-cosmic-gold-300/20 dark:bg-cosmic-gold-700/20 rounded-full blur-3xl"
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

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: -20 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.6 } : { duration: 0 }}
          className="text-center mb-6 md:mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-cosmic-gold-500 animate-pulse" aria-label="Sparkles icon" role="img" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cosmic-purple-600 via-cosmic-blue-600 to-cosmic-gold-600 dark:from-cosmic-purple-400 dark:via-cosmic-blue-400 dark:to-cosmic-gold-400 bg-clip-text text-transparent">
              Moon Mood
            </h1>
            <Sparkles className="w-8 h-8 text-cosmic-gold-500 animate-pulse" aria-label="Sparkles icon" role="img" />
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
            Vedic Astrology Dashboard
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-cosmic-purple-400 to-transparent" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Track cosmic influences on consciousness</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-cosmic-purple-400 to-transparent" />
          </div>
        </motion.div>

        {/* Location Selector */}
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.3 } : { duration: 0 }}
          className="flex justify-center mb-6"
        >
          <TimezoneSelector onLocationChange={setCurrentLocation} />
        </motion.div>

        <div className="flex flex-col space-y-6">
          {/* Notification Settings */}
          <NotificationSettings />

          {/* Live Chandrashtam Calculator */}
          <ChandrashtamCalculator />

          {/* Panchang and Nakshatra Info */}
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
            <PanchangDetails location={currentLocation} />
            <NakshatraInfo />
          </div>

          {/* Annual Chandrashtam Calendar */}
          <ChandrashtamAnnualView year={2025} />
        </div>

        {/* Footer */}
        <motion.footer
          initial={!prefersReducedMotion ? { opacity: 0 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1 } : {}}
          transition={!prefersReducedMotion ? { delay: 1, duration: 0.5 } : { duration: 0 }}
          className="mt-12 text-center text-xs text-gray-600 dark:text-gray-400"
        >
          <p>Calculations based on Vedic sidereal zodiac • Updates every minute</p>
          <p className="mt-1">Timings are approximate and for reference only</p>
        </motion.footer>
      </div>
    </div>
  )
}

export default App
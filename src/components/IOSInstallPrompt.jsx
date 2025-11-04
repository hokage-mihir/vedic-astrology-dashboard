import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, Plus, X, Clock, Smartphone } from 'lucide-react';
import { trackEvent } from '../services/analytics';

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (!isIOSDevice) {
      return;
    }

    // Check if permanently dismissed
    const permanentlyDismissed = localStorage.getItem('iosInstallPromptPermanentlyDismissed');
    if (permanentlyDismissed === 'true') {
      return;
    }

    // Check if temporarily dismissed (7 days)
    const dismissedTime = localStorage.getItem('iosInstallPromptDismissedTime');
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    if (dismissedTime && parseInt(dismissedTime) > sevenDaysAgo) {
      return;
    }

    // Check if already installed (running in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      return;
    }

    // Check engagement before showing (similar to regular install prompt)
    const visitCount = parseInt(localStorage.getItem('appVisitCount') || '0');

    // Show after 3 visits
    if (visitCount >= 3) {
      // Delay showing by 5 seconds to not interrupt initial experience
      setTimeout(() => {
        setShowPrompt(true);
        trackEvent('PWA', 'ios_prompt_shown', 'ios_install_instructions');
      }, 5000);
    }
  }, []);

  const handleDismissTemporary = () => {
    setShowPrompt(false);
    localStorage.setItem('iosInstallPromptDismissedTime', Date.now().toString());
    trackEvent('PWA', 'ios_dismissed_temp', 'remind_7_days');
  };

  const handleDismissPermanent = () => {
    setShowPrompt(false);
    localStorage.setItem('iosInstallPromptPermanentlyDismissed', 'true');
    trackEvent('PWA', 'ios_dismissed_perm', 'never_show');
  };

  if (!isIOS || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
      >
        <div className="bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 text-white rounded-xl shadow-2xl p-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

          {/* Close button */}
          <button
            onClick={handleDismissTemporary}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="font-bold text-base mb-1">Install Moon Mood</h3>
                <p className="text-xs text-white/90 leading-relaxed">
                  Add this app to your home screen for quick access!
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/10 rounded-lg p-3 mb-3 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-xs font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Tap the Share button</p>
                  <div className="flex items-center gap-1 text-white/80">
                    <Share className="w-4 h-4" />
                    <span>at the bottom of Safari</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-xs font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Select "Add to Home Screen"</p>
                  <div className="flex items-center gap-1 text-white/80">
                    <Plus className="w-4 h-4" />
                    <span>from the menu</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-xs font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Tap "Add" to confirm</p>
                </div>
              </div>
            </div>

            {/* Dismiss options */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={handleDismissTemporary}
                className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Remind in 7 days
              </button>
              <button
                onClick={handleDismissPermanent}
                className="flex-1 py-2 px-3 text-white/70 hover:bg-white/10 rounded-lg transition-colors"
              >
                Don't show again
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default IOSInstallPrompt;

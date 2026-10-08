import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, Plus, X, Clock, Smartphone } from 'lucide-react';
import { trackEvent } from '../services/analytics';
import { usePWAInstall, isIOSDevice } from '../lib/pwa-install';
import { readDismissal, dismissFor, dismissForever, getVisitCount } from '../lib/prompt-storage';

const STORAGE_PREFIX = 'iosInstallPrompt';
const SHOW_DELAY_MS = 5000;

/**
 * Add-to-Home-Screen instructions for iPhone/iPad, which have no install API.
 * Positioned by PromptDock.
 */
export function IOSInstallPrompt() {
  const { isInstalled } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!isIOSDevice() || isInstalled || readDismissal(STORAGE_PREFIX)) {
      return;
    }

    // Show after 3 visits, with a delay so it doesn't interrupt the first view
    if (getVisitCount() < 3) {
      return;
    }

    const timer = setTimeout(() => {
      setShowPrompt(true);
      trackEvent('PWA', 'ios_prompt_shown', 'ios_install_instructions');
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismissTemporary = () => {
    setShowPrompt(false);
    dismissFor(STORAGE_PREFIX);
    trackEvent('PWA', 'ios_dismissed_temp', 'remind_7_days');
  };

  const handleDismissPermanent = () => {
    setShowPrompt(false);
    dismissForever(STORAGE_PREFIX);
    trackEvent('PWA', 'ios_dismissed_perm', 'never_show');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          key="ios-install-prompt"
          role="dialog"
          aria-labelledby="ios-install-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 text-white rounded-xl shadow-2xl p-4 relative"
        >
          <button
            onClick={handleDismissTemporary}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-6">
              <h3 id="ios-install-title" className="font-bold text-base mb-1">Install Moon Mood</h3>
              <p className="text-xs text-white/90 leading-relaxed">
                Add the app to your Home Screen for one-tap access and Chandrashtam alerts.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <ol className="bg-white/10 rounded-lg p-3 mb-3 space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full font-bold">1</span>
              <span className="flex-1 flex flex-wrap items-center gap-1">
                Tap <Share className="w-4 h-4 inline" aria-label="Share" /> <span className="font-medium">Share</span>
                <span className="text-white/80">(in the toolbar, or under ••• in newer Safari)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full font-bold">2</span>
              <span className="flex-1 flex flex-wrap items-center gap-1">
                Choose <Plus className="w-4 h-4 inline" aria-hidden="true" /> <span className="font-medium">Add to Home Screen</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white/20 rounded-full font-bold">3</span>
              <span className="flex-1 font-medium">Tap Add to confirm</span>
            </li>
          </ol>

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
              className="flex-1 py-2 px-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
            >
              Don&apos;t show again
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IOSInstallPrompt;

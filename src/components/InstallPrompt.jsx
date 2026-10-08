import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Clock } from 'lucide-react';
import { trackEvent } from '../services/analytics';
import { usePWAInstall, promptInstall } from '../lib/pwa-install';
import { readDismissal, dismissFor, dismissForever, getVisitCount } from '../lib/prompt-storage';

const STORAGE_PREFIX = 'installPrompt';

/**
 * Install pop-up for browsers that support `beforeinstallprompt`
 * (Chrome/Edge/Samsung on Android and desktop). Positioned by PromptDock.
 */
export function InstallPrompt() {
  const { canInstall } = usePWAInstall();
  const [engaged, setEngaged] = useState(false);
  const [dismissed, setDismissed] = useState(() => readDismissal(STORAGE_PREFIX));
  const interactions = useRef(0);

  useEffect(() => {
    if (dismissed || engaged) return;

    // Show once the user is engaged: 3+ visits, 2+ minutes, or 10+ interactions
    if (getVisitCount() >= 3) {
      setEngaged(true);
      return;
    }

    const startTime = Date.now();
    const handleInteraction = () => {
      interactions.current += 1;
    };
    const checkEngagement = () => {
      if (interactions.current >= 10 || Date.now() - startTime >= 120000) {
        setEngaged(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    const engagementTimer = setInterval(checkEngagement, 10000);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearInterval(engagementTimer);
    };
  }, [dismissed, engaged]);

  const visible = canInstall && engaged && !dismissed;

  useEffect(() => {
    if (visible) {
      trackEvent('PWA', 'prompt_shown', 'install_prompt');
    }
  }, [visible]);

  const handleInstallClick = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      trackEvent('PWA', 'install_accepted', 'install_prompt');
    } else if (outcome === 'dismissed') {
      trackEvent('PWA', 'install_declined', 'install_prompt');
      dismissFor(STORAGE_PREFIX);
      setDismissed(true);
    }
  };

  const handleDismissTemporary = () => {
    dismissFor(STORAGE_PREFIX);
    setDismissed(true);
    trackEvent('PWA', 'install_dismissed_temp', 'remind_7_days');
  };

  const handleDismissPermanent = () => {
    dismissForever(STORAGE_PREFIX);
    setDismissed(true);
    trackEvent('PWA', 'install_dismissed_perm', 'never_show');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="install-prompt"
          role="dialog"
          aria-labelledby="install-prompt-title"
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

          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-6">
              <h3 id="install-prompt-title" className="font-bold text-base mb-1">Install Moon Mood</h3>
              <p className="text-xs text-white/90 leading-relaxed">
                Install the app for one-tap access, offline use and Chandrashtam alerts.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 px-4 bg-white text-cosmic-purple-700 font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>

            <div className="flex gap-2 text-xs">
              <button
                onClick={handleDismissTemporary}
                className="flex-1 py-2 px-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-1"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallPrompt;

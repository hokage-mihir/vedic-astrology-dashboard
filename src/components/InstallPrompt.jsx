import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Clock } from 'lucide-react';
import { trackEvent } from '../services/analytics';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [canShow, setCanShow] = useState(false);
  const engagementRef = useRef({
    visitCount: 0,
    startTime: Date.now(),
    interactions: 0,
  });

  useEffect(() => {
    // Check if permanently dismissed
    const permanentlyDismissed = localStorage.getItem('installPromptPermanentlyDismissed');
    if (permanentlyDismissed === 'true') {
      return;
    }

    // Check if temporarily dismissed (7 days)
    const dismissedTime = localStorage.getItem('installPromptDismissedTime');
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    if (dismissedTime && parseInt(dismissedTime) > sevenDaysAgo) {
      return;
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      return;
    }

    // Track visit count
    const visitCount = parseInt(localStorage.getItem('appVisitCount') || '0');
    localStorage.setItem('appVisitCount', (visitCount + 1).toString());
    engagementRef.current.visitCount = visitCount + 1;

    // Listen for the beforeinstallprompt event
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Track user engagement
    const handleInteraction = () => {
      engagementRef.current.interactions++;
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    // Check engagement periodically
    const checkEngagement = () => {
      const { visitCount, startTime, interactions } = engagementRef.current;
      const timeSpent = (Date.now() - startTime) / 1000; // seconds

      // Show prompt if:
      // - User has visited 3+ times, OR
      // - User has spent 2+ minutes on site, OR
      // - User has had 10+ interactions
      if (visitCount >= 3 || timeSpent >= 120 || interactions >= 10) {
        setCanShow(true);
      }
    };

    const engagementTimer = setInterval(checkEngagement, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearInterval(engagementTimer);
    };
  }, []);

  useEffect(() => {
    // Show prompt when both conditions are met
    if (deferredPrompt && canShow) {
      setShowPrompt(true);
      trackEvent('PWA', 'prompt_shown', 'install_prompt');
    }
  }, [deferredPrompt, canShow]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      trackEvent('PWA', 'install_accepted', 'install_prompt');
    } else {
      console.log('User dismissed the install prompt');
      trackEvent('PWA', 'install_declined', 'install_prompt');
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismissTemporary = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissedTime', Date.now().toString());
    trackEvent('PWA', 'install_dismissed_temp', 'remind_7_days');
  };

  const handleDismissPermanent = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptPermanentlyDismissed', 'true');
    trackEvent('PWA', 'install_dismissed_perm', 'never_show');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
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
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="font-bold text-base mb-1">Install Moon Mood</h3>
                <p className="text-xs text-white/90 leading-relaxed">
                  Install this app on your device for quick access and offline use!
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
                  className="flex-1 py-2 px-3 text-white/70 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Don't show again
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InstallPrompt;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, BarChart3 } from 'lucide-react';

export function CookieConsent({ onAccept, onReject }) {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('analyticsConsent');

    if (!consent) {
      // Show consent banner after 2 seconds (don't interrupt initial experience)
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setShowConsent(false);
    if (onAccept) {
      onAccept();
    }
  };

  const handleReject = () => {
    setShowConsent(false);
    if (onReject) {
      onReject();
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
      >
        <div className="bg-white rounded-xl shadow-2xl border-2 border-cosmic-purple-200 p-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cosmic-purple-100 to-cosmic-blue-100 rounded-full blur-3xl opacity-30 -mr-16 -mt-16"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-cosmic-purple-100 rounded-lg flex-shrink-0">
                <Cookie className="w-5 h-5 text-cosmic-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  Cookie & Privacy Notice
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  We use analytics to improve your experience. We collect anonymous usage data and don't track personal information.
                </p>

                {/* What we track */}
                <div className="bg-gray-50 rounded-lg p-2 mb-2 space-y-1">
                  <div className="flex items-start gap-2 text-xs">
                    <BarChart3 className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Page views and feature usage
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Shield className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Your IP is anonymized, no personal data collected
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  By accepting, you help us make Moon Mood better for everyone.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 bg-cosmic-purple-600 hover:bg-cosmic-purple-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CookieConsent;

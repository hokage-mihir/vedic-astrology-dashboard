import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import PropTypes from 'prop-types';

export function UpdateToast({ onUpdate, onDismiss }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 30 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = () => {
    setShow(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 text-white rounded-xl shadow-2xl p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="font-bold text-base mb-1">Update Available</h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    A new version of Moon Mood is ready. Reload to get the latest features and improvements.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-2.5 px-4 bg-white text-cosmic-purple-700 font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors font-medium text-sm"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

UpdateToast.propTypes = {
  onUpdate: PropTypes.func,
  onDismiss: PropTypes.func,
};

export default UpdateToast;

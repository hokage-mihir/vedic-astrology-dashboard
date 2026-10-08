import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import PropTypes from 'prop-types';

const AUTO_DISMISS_MS = 30000;

/**
 * "Update available" card. Visibility and positioning are owned by PromptDock,
 * which wraps it in AnimatePresence so the exit animation plays.
 */
export function UpdateToast({ onUpdate, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      role="alertdialog"
      aria-labelledby="update-toast-title"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-gradient-to-r from-cosmic-purple-600 to-cosmic-blue-600 text-white rounded-xl shadow-2xl p-4 relative"
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-6">
          <h3 id="update-toast-title" className="font-bold text-base mb-1">Update Available</h3>
          <p className="text-xs text-white/90 leading-relaxed">
            A new version of Moon Mood is ready. Reload to get the latest features and improvements.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onUpdate}
          className="flex-1 py-2.5 px-4 bg-white text-cosmic-purple-700 font-semibold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Now
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2.5 text-white/90 hover:bg-white/10 rounded-lg transition-colors font-medium text-sm"
        >
          Later
        </button>
      </div>
    </motion.div>
  );
}

UpdateToast.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default UpdateToast;

import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';
import { trackEvent } from '../services/analytics';
import { usePWAInstall, promptInstall } from '../lib/pwa-install';
import { useNotifications } from '../contexts/NotificationContext';

export function InstallButton({ className = '' }) {
  const { canInstall } = usePWAInstall();
  const { addToast } = useNotifications();
  const [isChecking, setIsChecking] = useState(false);

  const handleInstallClick = async () => {
    trackEvent('PWA', 'manual_install_click', 'footer_button');
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      trackEvent('PWA', 'manual_install_accepted', 'footer_button');
    } else if (outcome === 'dismissed') {
      trackEvent('PWA', 'manual_install_declined', 'footer_button');
    }
  };

  const handleUpdateCheck = async () => {
    setIsChecking(true);
    trackEvent('PWA', 'manual_update_check', 'footer_button');

    try {
      const registration = 'serviceWorker' in navigator
        ? await navigator.serviceWorker.getRegistration()
        : null;

      if (!registration) {
        addToast({ title: 'Updates unavailable', description: 'Offline support is not active in this browser.', type: 'info' });
        return;
      }

      await registration.update();

      // A found update installs in the background and then shows the
      // "Update Available" card via the service worker's onNeedRefresh.
      if (registration.installing || registration.waiting) {
        trackEvent('PWA', 'update_found', 'manual_check');
        addToast({ title: 'Update found', description: 'Downloading the new version…', type: 'info' });
      } else {
        trackEvent('PWA', 'already_updated', 'manual_check');
        addToast({ title: 'You’re up to date', description: 'You have the latest version of Moon Mood.', type: 'success' });
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      trackEvent('PWA', 'update_check_error', error.message);
      addToast({ title: 'Couldn’t check for updates', description: 'Please check your connection and try again.', type: 'error' });
    } finally {
      setIsChecking(false);
    }
  };

  // Show "Install App" when the browser offers installation
  if (canInstall) {
    return (
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cosmic-purple-600 bg-cosmic-purple-50 hover:bg-cosmic-purple-100 rounded-lg transition-colors ${className}`}
        aria-label="Install app"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // Otherwise offer a manual update check
  return (
    <button
      onClick={handleUpdateCheck}
      disabled={isChecking}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cosmic-purple-600 bg-cosmic-purple-50 hover:bg-cosmic-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label="Check for updates"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
      <span>{isChecking ? 'Checking...' : 'Check for Updates'}</span>
    </button>
  );
}

InstallButton.propTypes = {
  className: PropTypes.string,
};

export default InstallButton;

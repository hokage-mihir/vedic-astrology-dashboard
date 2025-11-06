import { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';
import { trackEvent } from '../services/analytics';

export function InstallButton({ className = '' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    setIsInstalled(checkInstalled);

    // Listen for the beforeinstallprompt event (for non-installed state)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    trackEvent('PWA', 'manual_install_click', 'footer_button');

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt from manual button');
      trackEvent('PWA', 'manual_install_accepted', 'footer_button');
      setIsInstalled(true);
    } else {
      trackEvent('PWA', 'manual_install_declined', 'footer_button');
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
  };

  const handleUpdateCheck = async () => {
    setIsChecking(true);
    trackEvent('PWA', 'manual_update_check', 'footer_button');

    try {
      // Check if service worker is supported
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
          // Force check for updates
          await registration.update();
          console.log('Checked for updates');

          // Wait a bit to see if there's an update
          setTimeout(() => {
            // If there's a waiting service worker, it means there's an update
            if (registration.waiting) {
              console.log('Update available! Refreshing...');
              trackEvent('PWA', 'update_found', 'manual_check');

              // Tell the waiting service worker to activate
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });

              // Reload the page to get the new version
              window.location.reload();
            } else {
              console.log('App is up to date');
              trackEvent('PWA', 'already_updated', 'manual_check');

              // Show feedback to user
              alert('App is already up to date!');
              setIsChecking(false);
            }
          }, 1000);
        } else {
          console.log('No service worker registration found');
          setIsChecking(false);
        }
      } else {
        console.log('Service workers not supported');
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      trackEvent('PWA', 'update_check_error', error.message);
      setIsChecking(false);
    }
  };

  // Show "Install App" if not installed and prompt is available
  if (!isInstalled && deferredPrompt) {
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

  // Show "Check for Updates" if installed or no prompt available
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

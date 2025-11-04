import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import PropTypes from 'prop-types';

export function InstallButton({ className = '' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      setIsInstallable(false);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
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

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt from manual button');
      setIsInstallable(false);
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
  };

  if (!isInstallable) {
    return null;
  }

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

InstallButton.propTypes = {
  className: PropTypes.string,
};

export default InstallButton;

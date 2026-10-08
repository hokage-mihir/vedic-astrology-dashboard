import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NotificationProvider } from './contexts/NotificationContext'
import { registerSW } from 'virtual:pwa-register'
import { PromptDock } from './components/PromptDock'
import { initializeAnalytics, enableAnalytics, disableAnalytics, trackRoutePageView } from './services/analytics'
// Imported for its side effect: captures `beforeinstallprompt` as early as possible
import './lib/pwa-install'

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

// Lets the service worker callback reach React state
let showUpdateToast = null;
let updateAvailable = false;

// Register service worker for PWA. In "prompt" mode a new version waits until
// the user chooses to reload, instead of reloading the page under them.
const updateSW = registerSW({
  onNeedRefresh() {
    updateAvailable = true;
    showUpdateToast?.();
  },
  onRegisteredSW(_swUrl, registration) {
    // Installed PWAs can stay open for days; check for new versions hourly
    if (registration) {
      setInterval(() => registration.update(), UPDATE_CHECK_INTERVAL_MS);
    }
  },
})

// Initialize before the first render: page components send their page view
// from effects, which run before any effect in Root would
initializeAnalytics();

const hasConsentChoice = () => {
  try {
    return !!localStorage.getItem('analyticsConsent');
  } catch {
    return true;
  }
};

function Root() {
  const [needsUpdate, setNeedsUpdate] = React.useState(updateAvailable);
  const [consentPending, setConsentPending] = React.useState(() => !hasConsentChoice());

  React.useEffect(() => {
    // Allow service worker to trigger update toast
    showUpdateToast = () => setNeedsUpdate(true);
  }, []);

  const handleUpdate = React.useCallback(() => {
    setNeedsUpdate(false);
    updateSW(true);
  }, []);

  const handleDismissUpdate = React.useCallback(() => {
    setNeedsUpdate(false);
  }, []);

  const handleAcceptCookies = () => {
    setConsentPending(false);
    // The current page rendered before consent, so record its view now
    if (enableAnalytics()) {
      trackRoutePageView(window.location.pathname);
    }
  };

  const handleRejectCookies = () => {
    setConsentPending(false);
    disableAnalytics();
  };

  return (
    <React.StrictMode>
      <NotificationProvider>
        <App />
        <PromptDock
          needsUpdate={needsUpdate}
          onUpdate={handleUpdate}
          onDismissUpdate={handleDismissUpdate}
          consentPending={consentPending}
          onAcceptCookies={handleAcceptCookies}
          onRejectCookies={handleRejectCookies}
        />
      </NotificationProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)

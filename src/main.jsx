import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NotificationProvider } from './contexts/NotificationContext'
import { registerSW } from 'virtual:pwa-register'
import { UpdateToast } from './components/UpdateToast'
import { CookieConsent } from './components/CookieConsent'
import { initializeAnalytics, enableAnalytics, disableAnalytics } from './services/analytics'

// Create a container for the update toast
let showUpdateToast = null;

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Show toast instead of confirm dialog
    if (showUpdateToast) {
      showUpdateToast();
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

function Root() {
  const [needsUpdate, setNeedsUpdate] = React.useState(false);

  React.useEffect(() => {
    // Allow service worker to trigger update toast
    showUpdateToast = () => setNeedsUpdate(true);

    // Try to initialize analytics if consent already given
    initializeAnalytics();
  }, []);

  const handleUpdate = () => {
    setNeedsUpdate(false);
    updateSW(true);
  };

  const handleDismiss = () => {
    setNeedsUpdate(false);
  };

  const handleAcceptCookies = () => {
    const initialized = enableAnalytics();
    if (initialized) {
      console.log('Analytics enabled with user consent');
    }
  };

  const handleRejectCookies = () => {
    disableAnalytics();
    console.log('Analytics disabled by user choice');
  };

  return (
    <React.StrictMode>
      <NotificationProvider>
        <App />
        {needsUpdate && (
          <UpdateToast onUpdate={handleUpdate} onDismiss={handleDismiss} />
        )}
        <CookieConsent
          onAccept={handleAcceptCookies}
          onReject={handleRejectCookies}
        />
      </NotificationProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
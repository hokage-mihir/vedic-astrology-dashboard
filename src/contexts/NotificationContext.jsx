import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { ToastContainer } from '@/components/ui/toast';
import PropTypes from 'prop-types';

const NotificationContext = createContext(null);

const SETTINGS_KEY = 'notificationSettings';
const DEFAULT_SETTINGS = {
  chandrashtamStart: true,
  chandrashtamEnd: true,
  browserNotifications: false,
  soundEnabled: true,
};

const NOTIFICATION_ICON = '/icon-192x192.png';
const NOTIFICATION_BADGE = '/badge-96x96.png';

const loadSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return saved && typeof saved === 'object' ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const getPermission = () => ('Notification' in window ? Notification.permission : 'unsupported');

/**
 * Show a system notification. Android Chrome only allows notifications through
 * the service worker (`new Notification()` throws there), so prefer that path.
 */
const showSystemNotification = async (title, options) => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
  }
  const notification = new Notification(title, options);
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

let toastId = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [permission, setPermission] = useState(getPermission);
  const [notificationSettings, setNotificationSettings] = useState(loadSettings);
  const toastTimers = useRef(new Map());

  // Keep permission in sync if the user changes it in browser settings
  useEffect(() => {
    if (!navigator.permissions?.query) return;
    let status;
    const handleChange = () => setPermission(getPermission());
    navigator.permissions
      .query({ name: 'notifications' })
      .then((result) => {
        status = result;
        status.addEventListener('change', handleChange);
      })
      .catch(() => {});
    return () => status?.removeEventListener('change', handleChange);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(notificationSettings));
    } catch {
      // Storage unavailable (private mode); settings stay in memory
    }
  }, [notificationSettings]);

  const removeToast = useCallback((id) => {
    clearTimeout(toastTimers.current.get(id));
    toastTimers.current.delete(id);
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ title, description, type = 'info', duration = 5000 }) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, title, description, type }]);

    if (duration > 0) {
      toastTimers.current.set(id, setTimeout(() => removeToast(id), duration));
    }

    return id;
  }, [removeToast]);

  const browserNotificationsEnabled = permission === 'granted';

  const showNotification = useCallback(async ({ title, body, type = 'info', duration = 5000, tag }) => {
    // Always show an in-app toast
    addToast({ title, description: body, type, duration });

    if (!notificationSettings.browserNotifications || !browserNotificationsEnabled) {
      return;
    }

    try {
      await showSystemNotification(title, {
        body,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_BADGE,
        tag: tag || `moon-mood-${Date.now()}`,
        silent: !notificationSettings.soundEnabled,
        data: { url: '/' },
      });
    } catch (error) {
      console.error('Failed to show browser notification:', error);
    }
  }, [addToast, notificationSettings.browserNotifications, notificationSettings.soundEnabled, browserNotificationsEnabled]);

  const requestBrowserPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    let result = Notification.permission;
    if (result === 'default') {
      result = await Notification.requestPermission();
    }
    setPermission(result);

    const granted = result === 'granted';
    setNotificationSettings(prev => ({ ...prev, browserNotifications: granted }));
    return granted;
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setNotificationSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    showNotification,
    requestBrowserPermission,
    browserNotificationsEnabled,
    notificationPermission: permission,
    notificationSettings,
    updateSettings,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

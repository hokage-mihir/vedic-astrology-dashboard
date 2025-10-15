import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ToastContainer } from '@/components/ui/toast';
import PropTypes from 'prop-types';

const NotificationContext = createContext(null);

let toastId = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      chandrashtamStart: true,
      chandrashtamEnd: true,
      browserNotifications: false,
    };
  });

  // Check browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setBrowserNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  const addToast = useCallback(({ title, description, type = 'info', duration = 5000 }) => {
    const id = toastId++;
    const toast = { id, title, description, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showNotification = useCallback(async ({ title, body, type = 'info', duration = 5000 }) => {
    // Always show toast notification
    addToast({ title, description: body, type, duration });

    // Show browser notification if enabled
    if (notificationSettings.browserNotifications && browserNotificationsEnabled) {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/icon.png', // You can add an icon file to public folder
          badge: '/badge.png',
          tag: `notification-${Date.now()}`,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Failed to show browser notification:', error);
      }
    }
  }, [addToast, notificationSettings.browserNotifications, browserNotificationsEnabled]);

  const requestBrowserPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setBrowserNotificationsEnabled(true);
      setNotificationSettings(prev => ({ ...prev, browserNotifications: true }));
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setBrowserNotificationsEnabled(granted);
      setNotificationSettings(prev => ({ ...prev, browserNotifications: granted }));
      return granted;
    }

    return false;
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

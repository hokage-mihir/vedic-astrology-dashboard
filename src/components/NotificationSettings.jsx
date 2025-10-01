import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, BellOff, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationSettings() {
  const {
    notificationSettings,
    updateSettings,
    requestBrowserPermission,
    browserNotificationsEnabled,
    showNotification
  } = useNotifications();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleBrowserNotificationToggle = async () => {
    if (!notificationSettings.browserNotifications) {
      const granted = await requestBrowserPermission();
      if (granted) {
        showNotification({
          title: 'Browser Notifications Enabled',
          body: 'You will now receive notifications even when the tab is not active.',
          type: 'success'
        });
      } else {
        showNotification({
          title: 'Permission Denied',
          body: 'Please enable notifications in your browser settings.',
          type: 'error'
        });
      }
    } else {
      updateSettings({ browserNotifications: false });
    }
  };

  const handleSettingToggle = (key) => {
    updateSettings({ [key]: !notificationSettings[key] });
  };

  const testNotification = () => {
    showNotification({
      title: 'Test Notification',
      body: 'This is a test notification to verify your settings are working correctly.',
      type: 'info'
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-cosmic-purple-200 dark:border-cosmic-purple-800">
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cosmic-purple-500" aria-label="Settings icon" />
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Notification Settings
            </CardTitle>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {/* Browser Notifications */}
              <div className="flex items-center justify-between p-3 bg-cosmic-purple-50 dark:bg-cosmic-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  {browserNotificationsEnabled ? (
                    <Bell className="w-5 h-5 text-cosmic-purple-500" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Browser Notifications</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get notified even when tab is not active
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleBrowserNotificationToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.browserNotifications
                      ? 'bg-cosmic-purple-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.browserNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Chandrashtam Start Notifications */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Chandrashtam Start</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Alert when a new period begins
                  </p>
                </div>
                <button
                  onClick={() => handleSettingToggle('chandrashtamStart')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.chandrashtamStart
                      ? 'bg-cosmic-purple-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.chandrashtamStart ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Chandrashtam End Notifications */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Chandrashtam End</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Alert when a period ends
                  </p>
                </div>
                <button
                  onClick={() => handleSettingToggle('chandrashtamEnd')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.chandrashtamEnd
                      ? 'bg-cosmic-purple-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.chandrashtamEnd ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Test Notification Button */}
              <button
                onClick={testNotification}
                className="w-full p-3 bg-cosmic-blue-500 hover:bg-cosmic-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Test Notification
              </button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

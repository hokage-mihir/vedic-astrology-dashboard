import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import PropTypes from 'prop-types';

export function NotificationSettings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    notificationSettings,
    updateSettings,
    requestBrowserPermission,
    browserNotificationsEnabled,
    showNotification,
  } = useNotifications();

  const handleBrowserNotificationToggle = async (checked) => {
    if (checked && !browserNotificationsEnabled) {
      const granted = await requestBrowserPermission();
      if (!granted) {
        return;
      }
    }
    updateSettings({ browserNotifications: checked });
  };

  const handleTestNotification = () => {
    showNotification({
      title: 'Test Notification',
      body: 'This is a test notification from Moon Mood!',
      type: 'info',
    });
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm backdrop-blur-sm bg-white/90">
      <CardHeader
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cosmic-purple-500" aria-label="Settings icon" />
          <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
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
      </CardHeader>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-3">
            <ToggleOption
              label="Chandrashtam Start Alerts"
              description="Get notified when YOUR selected Rashi enters Chandrashtam"
              checked={notificationSettings.chandrashtamStart}
              onChange={(checked) => updateSettings({ chandrashtamStart: checked })}
            />

            <ToggleOption
              label="Chandrashtam End Alerts"
              description="Get notified when YOUR Chandrashtam period ends"
              checked={notificationSettings.chandrashtamEnd}
              onChange={(checked) => updateSettings({ chandrashtamEnd: checked })}
            />

            <ToggleOption
              label="Browser Notifications"
              description="Receive notifications even when the app is in background"
              checked={notificationSettings.browserNotifications}
              onChange={handleBrowserNotificationToggle}
            />

            <ToggleOption
              label="Sound Alerts"
              description="Play sound with notifications"
              checked={notificationSettings.soundEnabled}
              onChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full px-4 py-2 bg-cosmic-purple-100 hover:bg-cosmic-purple-200 text-cosmic-purple-700 font-medium rounded-lg transition-colors"
          >
            Test Notification
          </button>
        </CardContent>
      </motion.div>
    </div>
  );
}

function ToggleOption({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-gray-900 text-sm">{label}</div>
        <div className="text-xs text-gray-600 mt-0.5">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cosmic-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmic-purple-600"></div>
      </label>
    </div>
  );
}

ToggleOption.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

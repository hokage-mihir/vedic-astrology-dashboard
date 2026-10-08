import { useEffect, useRef } from 'react';
import { useLocationContext } from '../contexts/LocationContext';
import { useNotifications } from '../contexts/NotificationContext';
import { getChandrashtamPeriod } from '../lib/chandrashtam-calculator';
import { previousMoonIngress } from '../lib/astro-core';
import { RASHI_ORDER, CHANDRASHTAM_MAP } from '../lib/vedic-constants';

const LAST_ALERT_KEY = 'chandrashtamLastAlert';
// Re-check at least this often so timers stay accurate after sleep/throttling
const MAX_TIMER_MS = 30 * 60 * 1000;
// Announce a transition that happened while the app was closed/asleep if it is this recent
const CATCH_UP_WINDOW_MS = 2 * 60 * 60 * 1000;

const formatWhen = (date) =>
  date.toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });

const readLastAlert = () => {
  try {
    return localStorage.getItem(LAST_ALERT_KEY);
  } catch {
    return null;
  }
};

const writeLastAlert = (key) => {
  try {
    localStorage.setItem(LAST_ALERT_KEY, key);
  } catch {
    // ignore
  }
};

/**
 * The most recent Chandrashtam start or end for a Rashi at `now`.
 */
const getLatestTransition = (rashi, period, now) => {
  if (period.active) {
    return { type: 'start', at: period.start, until: period.end };
  }
  const exitIndex = (RASHI_ORDER.indexOf(CHANDRASHTAM_MAP[rashi]) + 1) % 12;
  return { type: 'end', at: previousMoonIngress(exitIndex, now), next: period.start };
};

/**
 * Schedules Chandrashtam start/end alerts for the selected Rashi at the exact
 * Moon ingress times. Runs on every page while the app is open; transitions
 * missed while the device slept are announced on return if still recent.
 */
export function useChandrashtamAlerts() {
  const { selectedRashi } = useLocationContext();
  const { showNotification, notificationSettings } = useNotifications();

  const latest = useRef({ showNotification, notificationSettings });
  useEffect(() => {
    latest.current = { showNotification, notificationSettings };
  }, [showNotification, notificationSettings]);

  useEffect(() => {
    if (!selectedRashi || !CHANDRASHTAM_MAP[selectedRashi]) return;

    let timer;

    const announce = (rashi, transition) => {
      const key = `${rashi}|${transition.type}|${transition.at.toISOString()}`;
      if (readLastAlert() === key) return;
      writeLastAlert(key);

      const { showNotification: notify, notificationSettings: settings } = latest.current;
      if (transition.type === 'start' && settings.chandrashtamStart) {
        notify({
          title: '⚠️ Your Chandrashtam has started',
          body: `${rashi} Rashi is in Chandrashtam until ${formatWhen(transition.until)}. Practice awareness and patience.`,
          type: 'warning',
          duration: 10000,
          tag: key,
        });
      } else if (transition.type === 'end' && settings.chandrashtamEnd) {
        notify({
          title: '✓ Your Chandrashtam has ended',
          body: `Clear skies for ${rashi} Rashi. Next Chandrashtam begins ${formatWhen(transition.next)}.`,
          type: 'success',
          duration: 8000,
          tag: key,
        });
      }
    };

    const check = (isInitial = false) => {
      clearTimeout(timer);
      const now = new Date();
      const period = getChandrashtamPeriod(selectedRashi, now);
      if (!period) return;

      const transition = getLatestTransition(selectedRashi, period, now);
      const key = `${selectedRashi}|${transition.type}|${transition.at.toISOString()}`;
      if (now - transition.at <= CATCH_UP_WINDOW_MS) {
        announce(selectedRashi, transition);
      } else if (isInitial && readLastAlert() !== key) {
        // Old transition: remember it silently so it is never announced late
        writeLastAlert(key);
      }

      const nextTransition = period.active ? period.end : period.start;
      const delay = Math.min(Math.max(nextTransition - now + 1000, 1000), MAX_TIMER_MS);
      timer = setTimeout(() => check(false), delay);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') check(false);
    };

    check(true);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [selectedRashi]);
}

/** Renders nothing; mounts the alert scheduler inside the providers. */
export function ChandrashtamAlerts() {
  useChandrashtamAlerts();
  return null;
}

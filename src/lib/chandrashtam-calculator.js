import { RASHI_ORDER, CHANDRASHTAM_MAP } from './vedic-constants.js';
import { moonRashiSpan, previousMoonIngress } from './astro-core.js';

const DAY_MS = 86400000;
const APPROACH_WINDOW_DAYS = 3;

/**
 * Find the current (or next) Chandrashtam period for a Rashi.
 * @returns {{ start: Date, end: Date, active: boolean } | null}
 */
export function getChandrashtamPeriod(userRashi, now = new Date()) {
  const afflictingMoonIndex = RASHI_ORDER.indexOf(CHANDRASHTAM_MAP[userRashi]);
  if (afflictingMoonIndex === -1) return null;
  return moonRashiSpan(afflictingMoonIndex, now);
}

/**
 * Calculate exact time until Chandrashtam starts, or until it ends if active.
 * Transition times are solved from the Moon's actual position, not extrapolated.
 */
export function calculatePreciseDaysUntilChandrashtam(userRashi, now = new Date()) {
  const period = userRashi ? getChandrashtamPeriod(userRashi, now) : null;
  if (!period) {
    return { days: 0, hours: 0, totalDays: 0, status: 'unknown' };
  }

  const afflictingIndex = RASHI_ORDER.indexOf(CHANDRASHTAM_MAP[userRashi]);
  const target = period.active ? period.end : period.start;
  const totalDays = Math.max(0, (target - now) / DAY_MS);

  return {
    days: Math.floor(totalDays),
    hours: Math.floor((totalDays % 1) * 24),
    totalDays,
    active: period.active,
    afflictingIndex,
    start: period.start,
    end: period.end
  };
}

/**
 * Get Chandrashtam status for the user's Rashi at a given moment
 */
export function getChandrashtamStatus(userRashi, now = new Date()) {
  if (!userRashi) {
    return { status: 'unknown', color: 'gray', message: 'Select your Rashi to see status' };
  }

  if (!CHANDRASHTAM_MAP[userRashi]) {
    return { status: 'unknown', color: 'gray', message: 'Invalid Rashi selection' };
  }

  const timeUntil = calculatePreciseDaysUntilChandrashtam(userRashi, now);

  // Check if currently afflicted
  if (timeUntil.active) {
    return {
      status: 'active',
      color: 'red',
      title: '🚨 Active - Chandrashtam in Effect',
      message: 'On Chandra Ashtama days, the Moon induces more negative thoughts in your mind, brings confusion, and adds stress. However, awareness is your protection.',
      guidance: [
        'Recognize this is a temporary cosmic influence',
        'Practice patience and self-compassion',
        'Avoid making important life decisions',
        'Observe your thoughts without judgment',
        'Increase meditation or spiritual practices',
        'Remember: Just being aware of these days can save your mind from negative effects',
        'Relax knowing this is a cosmic game'
      ],
      timeUntil
    };
  }

  // Check if approaching (within ~3 days)
  if (timeUntil.totalDays <= APPROACH_WINDOW_DAYS) {
    return {
      status: 'approaching',
      color: 'yellow',
      title: '⚠️ Approaching - Chandrashtam Coming Soon',
      message: `Your Chandrashtam period begins in approximately ${timeUntil.days} days ${timeUntil.hours} hours. Start preparing mentally and emotionally.`,
      guidance: [
        'Increase mindfulness practices',
        'Observe your thought patterns',
        'Practice patience and self-awareness',
        'Avoid scheduling major decisions',
        'Prepare for a period of introspection'
      ],
      timeUntil
    };
  }

  // Clear period
  return {
    status: 'clear',
    color: 'green',
    title: '✅ Clear - No Chandrashtam Active',
    message: 'Your Chandrashtam period is not active. This is a favorable time for important decisions, starting new projects, and engaging in significant activities.',
    guidance: [
      'You can proceed with your daily routine with confidence, awareness and mindfulness',
      'Mental clarity and emotional stability support your goals',
    ],
    timeUntil
  };
}

/**
 * Format time remaining in human-readable format
 */
export function formatTimeRemaining(days, hours) {
  if (days === 0 && hours === 0) {
    return 'Less than an hour';
  }

  if (days === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  if (hours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
}

const clampPercent = (value) => Math.max(0, Math.min(100, value));

/**
 * Calculate progress percentage for countdown ring
 * - ACTIVE (red): share of the current Chandrashtam already elapsed
 * - APPROACHING (yellow): progress through the 3-day warning window
 * - CLEAR (green): progress from the last Chandrashtam's end to the next start
 */
export function calculateProgress(timeUntil, status = 'clear', now = new Date()) {
  if (!timeUntil || !timeUntil.start || !timeUntil.end) {
    return 0;
  }

  if (status === 'active') {
    return clampPercent(((now - timeUntil.start) / (timeUntil.end - timeUntil.start)) * 100);
  }

  if (status === 'approaching') {
    return clampPercent(((APPROACH_WINDOW_DAYS - timeUntil.totalDays) / APPROACH_WINDOW_DAYS) * 100);
  }

  // The previous Chandrashtam ended when the Moon last left the afflicting rashi
  const previousEnd = previousMoonIngress((timeUntil.afflictingIndex + 1) % 12, now);
  return clampPercent(((now - previousEnd) / (timeUntil.start - previousEnd)) * 100);
}

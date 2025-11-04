import { RASHI_ORDER, CHANDRASHTAM_MAP } from './vedic-constants.js';

/**
 * Calculate precise time until Chandrashtam using Moon's speed
 * Uses actual Moon position in degrees for accurate timing
 */
export function calculatePreciseDaysUntilChandrashtam(userRashi, moonData) {
  if (!userRashi || !moonData) {
    return { days: 0, hours: 0, totalDays: 0, status: 'unknown' };
  }

  const { rashi_number, degrees_in_rashi, speed } = moonData;
  const afflictingMoonRashi = CHANDRASHTAM_MAP[userRashi];

  if (!afflictingMoonRashi) {
    return { days: 0, hours: 0, totalDays: 0, status: 'unknown' };
  }

  const afflictingMoonIndex = RASHI_ORDER.indexOf(afflictingMoonRashi);
  const currentMoonIndex = rashi_number;

  // Special case: Moon is already in the afflicting Rashi
  // Calculate time remaining in current Rashi (when Chandrashtam ends)
  if (currentMoonIndex === afflictingMoonIndex) {
    const degreesLeft = 30 - degrees_in_rashi;
    const hoursLeft = (degreesLeft / speed) * 24;

    return {
      days: Math.floor(hoursLeft / 24),
      hours: Math.floor(hoursLeft % 24),
      totalDays: hoursLeft / 24
    };
  }

  // Calculate total degrees to travel to reach afflicting Rashi
  let totalDegrees;

  if (afflictingMoonIndex > currentMoonIndex) {
    // Moon needs to travel forward
    const rashiDistance = afflictingMoonIndex - currentMoonIndex;
    totalDegrees = (30 - degrees_in_rashi) + (rashiDistance - 1) * 30;
  } else {
    // Moon needs to complete cycle (wrap around)
    const rashiDistance = 12 - currentMoonIndex + afflictingMoonIndex;
    totalDegrees = (30 - degrees_in_rashi) + (rashiDistance - 1) * 30;
  }

  // Moon speed is in degrees per day
  const daysUntil = totalDegrees / speed;

  return {
    days: Math.floor(daysUntil),
    hours: Math.floor((daysUntil % 1) * 24),
    totalDays: daysUntil
  };
}

/**
 * Get Chandrashtam status based on user's Rashi and current Moon position
 */
export function getChandrashtamStatus(userRashi, currentMoonRashi, moonData) {
  if (!userRashi || !currentMoonRashi || !moonData) {
    return { status: 'unknown', color: 'gray', message: 'Select your Rashi to see status' };
  }

  const afflictingMoonRashi = CHANDRASHTAM_MAP[userRashi];
  
  if (!afflictingMoonRashi) {
    return { status: 'unknown', color: 'gray', message: 'Invalid Rashi selection' };
  }

  // Check if currently afflicted
  if (currentMoonRashi === afflictingMoonRashi) {
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
      ]
    };
  }

  // Calculate days until next Chandrashtam
  const timeUntil = calculatePreciseDaysUntilChandrashtam(userRashi, moonData);
  
  // Check if approaching (within ~3 days)
  if (timeUntil.totalDays <= 3) {
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
    return 'Active now';
  }
  
  if (days === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (hours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
}

/**
 * Calculate progress percentage for countdown ring
 */
export function calculateProgress(timeUntil) {
  if (!timeUntil || timeUntil.totalDays === 0) {
    return 100; // Active now
  }
  
  // Total lunar cycle is ~27.32 days
  const totalCycle = 27.32;
  const progress = ((totalCycle - timeUntil.totalDays) / totalCycle) * 100;
  
  return Math.max(0, Math.min(100, progress));
}
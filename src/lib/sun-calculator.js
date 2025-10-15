import SunCalc from 'suncalc';

/**
 * Calculate real sunrise and sunset times for a given location and date
 * @param {Object} location - Location object with latitude and longitude
 * @param {Date} date - The date to calculate for (defaults to now)
 * @returns {Object} Object containing sunrise and sunset Date objects
 */
export const calculateSunTimes = (location, date = new Date()) => {
  const times = SunCalc.getTimes(date, location.latitude, location.longitude);

  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
    solarNoon: times.solarNoon,
    dawn: times.dawn,
    dusk: times.dusk,
  };
};

/**
 * Format time to HH:MM AM/PM format
 * @param {Date} date - The date object to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A';
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * Calculate Rahu Kalam timing (generic calculation based on sunrise/sunset)
 * Rahu Kalam is an inauspicious period based on the day of the week
 * @param {Date} sunrise - Sunrise time
 * @param {Date} sunset - Sunset time
 * @param {number} dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 * @returns {Object} Object with start and end times for Rahu Kalam
 */
export const calculateRahuKalam = (sunrise, sunset, dayOfWeek = new Date().getDay()) => {
  if (!sunrise || !sunset || isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) {
    return { start: null, end: null };
  }

  const dayDuration = sunset.getTime() - sunrise.getTime();
  const segment = dayDuration / 8; // Divide day into 8 segments

  // Rahu Kalam segment based on day of week (traditional calculation)
  // Mnemonic: "Mother Saw Father Wearing The Turban Suddenly"
  // (M-onday, S-aturday, F-riday, W-ednesday, T-hursday, T-uesday, S-unday)
  const rahuKalamSegments = {
    0: 8, // Sunday - 8th segment
    1: 2, // Monday - 2nd segment
    2: 7, // Tuesday - 7th segment
    3: 5, // Wednesday - 5th segment
    4: 6, // Thursday - 6th segment
    5: 4, // Friday - 4th segment
    6: 3, // Saturday - 3rd segment
  };

  const segmentNumber = rahuKalamSegments[dayOfWeek];
  const startTime = new Date(sunrise.getTime() + (segmentNumber - 1) * segment);
  const endTime = new Date(sunrise.getTime() + segmentNumber * segment);

  return {
    start: startTime,
    end: endTime,
  };
};

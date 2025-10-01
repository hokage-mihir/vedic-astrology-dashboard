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
  const rahuKalamSegments = {
    0: 7, // Sunday - 7th segment
    1: 1, // Monday - 1st segment
    2: 6, // Tuesday - 6th segment
    3: 4, // Wednesday - 4th segment
    4: 5, // Thursday - 5th segment
    5: 3, // Friday - 3rd segment
    6: 2, // Saturday - 2nd segment
  };

  const segmentNumber = rahuKalamSegments[dayOfWeek];
  const startTime = new Date(sunrise.getTime() + (segmentNumber - 1) * segment);
  const endTime = new Date(sunrise.getTime() + segmentNumber * segment);

  return {
    start: startTime,
    end: endTime,
  };
};

import SunCalc from 'suncalc';

const DAY_MS = 86400000;

const deviceTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Civil date (year, month 1-12, day) of an instant in a timezone.
 */
export const getZonedDate = (date = new Date(), timeZone = deviceTimeZone()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return { year: get('year'), month: get('month'), day: get('day') };
};

/** Stable "YYYY-MM-DD" key for the civil date in a timezone. */
export const getZonedDateKey = (date = new Date(), timeZone = deviceTimeZone()) => {
  const { year, month, day } = getZonedDate(date, timeZone);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Civil date in `timeZone`, shifted by `offsetDays`, with its weekday.
 * Calendar arithmetic is done in UTC so DST changes can't skip or repeat a day.
 */
export const getZonedDay = (date = new Date(), timeZone = deviceTimeZone(), offsetDays = 0) => {
  const { year, month, day } = getZonedDate(date, timeZone);
  const utcMidnight = new Date(Date.UTC(year, month - 1, day) + offsetDays * DAY_MS);
  return {
    year: utcMidnight.getUTCFullYear(),
    month: utcMidnight.getUTCMonth() + 1,
    day: utcMidnight.getUTCDate(),
    dayOfWeek: utcMidnight.getUTCDay(),
    // Noon UTC on that date: safe anchor for formatting the date label
    labelDate: new Date(utcMidnight.getTime() + DAY_MS / 2),
  };
};

/**
 * Calculate sunrise and sunset for a civil date at a location.
 * SunCalc returns the events around the solar noon nearest the given instant,
 * so we pass the approximate local solar noon for that date.
 * @param {Object} location - { latitude, longitude }
 * @param {{year:number, month:number, day:number}} civilDate - date at the location
 */
export const calculateSunTimesForDay = (location, { year, month, day }) => {
  const solarNoonApprox = Date.UTC(year, month - 1, day, 12) - (location.longitude / 15) * 3600000;
  const times = SunCalc.getTimes(new Date(solarNoonApprox), location.latitude, location.longitude);

  return {
    sunrise: times.sunrise,
    sunset: times.sunset,
    solarNoon: times.solarNoon,
    dawn: times.dawn,
    dusk: times.dusk,
  };
};

/**
 * Format a time as "h:mm AM/PM" in the given timezone (defaults to the device's).
 * @param {Date} date - The date object to format
 * @param {string} [timeZone] - IANA timezone, e.g. 'Asia/Kolkata'
 * @returns {string} Formatted time string
 */
export const formatTime = (date, timeZone) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(timeZone ? { timeZone } : {}),
  });
};

/**
 * Short timezone label such as "IST" or "GMT+1" for display.
 */
export const getTimeZoneLabel = (timeZone, date = new Date()) => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(date);
    return parts.find((p) => p.type === 'timeZoneName')?.value || timeZone;
  } catch {
    return timeZone;
  }
};

/** True when the timezone differs from the device's current UTC offset. */
export const isDifferentTimeZone = (timeZone, date = new Date()) =>
  getTimeZoneLabel(timeZone, date) !== getTimeZoneLabel(deviceTimeZone(), date);

/**
 * Calculate Rahu Kalam timing (generic calculation based on sunrise/sunset)
 * Rahu Kalam is an inauspicious period based on the day of the week
 * @param {Date} sunrise - Sunrise time
 * @param {Date} sunset - Sunset time
 * @param {number} dayOfWeek - Day of week at the location (0 = Sunday, 6 = Saturday)
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

/**
 * Rahu Kalam for the civil day `offsetDays` from today at a location.
 * @returns {{ start: Date|null, end: Date|null, dayOfWeek: number, labelDate: Date }}
 */
export const getRahuKalamForDay = (location, now = new Date(), offsetDays = 0) => {
  const civilDay = getZonedDay(now, location.timezone, offsetDays);
  const { sunrise, sunset } = calculateSunTimesForDay(location, civilDay);
  return {
    ...calculateRahuKalam(sunrise, sunset, civilDay.dayOfWeek),
    dayOfWeek: civilDay.dayOfWeek,
    labelDate: civilDay.labelDate,
  };
};

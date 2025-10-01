import { julian, moonposition } from 'astronomia';
import { RASHI_ORDER, CHANDRASHTAM_MAP } from './vedic-constants.js';

const normalize360 = (degrees) => {
    degrees = degrees % 360;
    return degrees < 0 ? degrees + 360 : degrees;
};

const calculateAyanamsa = (jd) => {
    const T = (jd - 2451545.0) / 36525;
    return 23.85 + 0.0137 * T;
};

/**
 * Calculate which Rashi the Moon is in for a given date
 * @param {Date} date - The date to check
 * @returns {Object} Object with rashi name, number, and degrees
 */
const getMoonRashiForDate = (date) => {
    try {
        const jd = julian.DateToJD(date);
        const moon = moonposition.position(jd);
        const longitude = normalize360(moon.lon * 180 / Math.PI);
        const ayanamsa = calculateAyanamsa(jd);
        const siderealLongitude = normalize360(longitude - ayanamsa);
        const rashiNumber = Math.floor(siderealLongitude / 30);
        const degreesInRashi = siderealLongitude % 30;

        return {
            rashi: RASHI_ORDER[rashiNumber],
            rashiNumber: rashiNumber,
            degrees: degreesInRashi,
            longitude: siderealLongitude
        };
    } catch (error) {
        console.error('Error calculating moon rashi:', error);
        return null;
    }
};

/**
 * Calculate all Chandrashtam periods for a specific Rashi in a year
 * @param {string} rashi - The Rashi to calculate for (e.g., 'Mesh', 'Vrishab')
 * @param {number} year - The year to calculate for
 * @returns {Array} Array of objects with start and end dates/times
 */
export const calculateChandrashtamForRashi = (rashi, year) => {
    const chandrashtamRashi = CHANDRASHTAM_MAP[rashi];
    if (!chandrashtamRashi) {
        console.error('Invalid rashi:', rashi);
        return [];
    }

    const periods = [];
    const startDate = new Date(year, 0, 1); // Jan 1
    const endDate = new Date(year, 11, 31, 23, 59, 59); // Dec 31

    // Check every 6 hours (Moon moves ~13° per day, ~0.5° per hour)
    // This gives us enough granularity without being too expensive
    const checkInterval = 6 * 60 * 60 * 1000; // 6 hours in ms
    let currentDate = new Date(startDate);
    let inChandrashtam = false;
    let periodStart = null;

    while (currentDate <= endDate) {
        const moonData = getMoonRashiForDate(currentDate);

        if (moonData && moonData.rashi === chandrashtamRashi) {
            if (!inChandrashtam) {
                // Entering Chandrashtam - refine to find exact entry time
                periodStart = refineTransitionTime(currentDate, chandrashtamRashi, true);
                inChandrashtam = true;
            }
        } else {
            if (inChandrashtam) {
                // Exiting Chandrashtam - refine to find exact exit time
                const periodEnd = refineTransitionTime(currentDate, chandrashtamRashi, false);
                periods.push({
                    start: periodStart,
                    end: periodEnd,
                    duration: (periodEnd - periodStart) / (1000 * 60 * 60) // hours
                });
                inChandrashtam = false;
                periodStart = null;
            }
        }

        currentDate = new Date(currentDate.getTime() + checkInterval);
    }

    // Handle case where year ends during Chandrashtam
    if (inChandrashtam && periodStart) {
        periods.push({
            start: periodStart,
            end: endDate,
            duration: (endDate - periodStart) / (1000 * 60 * 60),
            incomplete: true
        });
    }

    return periods;
};

/**
 * Refine the exact transition time when Moon enters/exits a Rashi
 * @param {Date} approximateTime - The approximate time of transition
 * @param {string} targetRashi - The Rashi we're looking for
 * @param {boolean} entering - True if entering, false if exiting
 * @returns {Date} Refined transition time
 */
const refineTransitionTime = (approximateTime, targetRashi, entering) => {
    // Binary search to find transition within 5-minute accuracy
    let start = new Date(approximateTime.getTime() - 6 * 60 * 60 * 1000); // 6 hours before
    let end = new Date(approximateTime.getTime() + 6 * 60 * 60 * 1000); // 6 hours after
    const minInterval = 5 * 60 * 1000; // 5 minutes

    while (end - start > minInterval) {
        const mid = new Date((start.getTime() + end.getTime()) / 2);
        const moonData = getMoonRashiForDate(mid);

        if (moonData) {
            const isInRashi = moonData.rashi === targetRashi;

            if (entering) {
                if (isInRashi) {
                    end = mid;
                } else {
                    start = mid;
                }
            } else {
                if (isInRashi) {
                    start = mid;
                } else {
                    end = mid;
                }
            }
        } else {
            break;
        }
    }

    return entering ? end : start;
};

/**
 * Calculate all Chandrashtam periods for all Rashis in a year
 * @param {number} year - The year to calculate for
 * @returns {Object} Object with Rashi names as keys and arrays of periods as values
 */
export const calculateAllChandrashtamForYear = (year) => {
    const allPeriods = {};

    RASHI_ORDER.forEach(rashi => {
        console.log(`Calculating Chandrashtam for ${rashi} in ${year}...`);
        allPeriods[rashi] = calculateChandrashtamForRashi(rashi, year);
    });

    return allPeriods;
};

/**
 * Get current Chandrashtam status for a specific Rashi
 * @param {string} rashi - The Rashi to check
 * @param {Array} periods - Pre-calculated periods for this Rashi
 * @param {Date} now - Current date/time (optional, defaults to now)
 * @returns {Object} Status object with active period info
 */
export const getCurrentChandrashtamStatus = (rashi, periods, now = new Date()) => {
    if (!periods || periods.length === 0) {
        return {
            isActive: false,
            currentPeriod: null,
            nextPeriod: null
        };
    }

    // Find active period
    const activePeriod = periods.find(period => {
        return now >= period.start && now <= period.end;
    });

    if (activePeriod) {
        return {
            isActive: true,
            currentPeriod: activePeriod,
            timeLeft: activePeriod.end - now,
            nextPeriod: null
        };
    }

    // Find next period
    const nextPeriod = periods.find(period => period.start > now);

    return {
        isActive: false,
        currentPeriod: null,
        nextPeriod: nextPeriod,
        timeUntilNext: nextPeriod ? nextPeriod.start - now : null
    };
};

/**
 * Format a period for display
 * @param {Object} period - Period object with start and end dates
 * @returns {string} Formatted string
 */
export const formatPeriod = (period) => {
    const startStr = period.start.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const endStr = period.end.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `${startStr} - ${endStr} (${period.duration.toFixed(1)}h)`;
};

/**
 * Get statistics about Chandrashtam periods for a Rashi
 * @param {Array} periods - Array of periods
 * @returns {Object} Statistics object
 */
export const getChandrashtamStats = (periods) => {
    if (!periods || periods.length === 0) {
        return {
            totalPeriods: 0,
            totalDuration: 0,
            averageDuration: 0,
            longestPeriod: null,
            shortestPeriod: null
        };
    }

    const completePeriods = periods.filter(p => !p.incomplete);
    const totalDuration = completePeriods.reduce((sum, p) => sum + p.duration, 0);
    const averageDuration = totalDuration / completePeriods.length;

    const sorted = [...completePeriods].sort((a, b) => a.duration - b.duration);

    return {
        totalPeriods: periods.length,
        totalDuration: totalDuration,
        averageDuration: averageDuration,
        longestPeriod: sorted[sorted.length - 1],
        shortestPeriod: sorted[0]
    };
};

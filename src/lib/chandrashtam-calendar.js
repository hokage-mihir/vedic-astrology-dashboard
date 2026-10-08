import { RASHI_ORDER, CHANDRASHTAM_MAP } from './vedic-constants.js';
import { nextMoonIngress, previousMoonIngress } from './astro-core.js';

const HOUR_MS = 60 * 60 * 1000;
// Widen the UTC year by a day on each side so the calendar is complete in every
// timezone (UTC-12 to UTC+14). The UI filters to the viewer's local year.
const YEAR_MARGIN_MS = 24 * HOUR_MS;

/**
 * Calculate all Chandrashtam periods for a Rashi that overlap a calendar year.
 * Start/end are the exact Moon ingress times (Lahiri), so a period that spans
 * New Year keeps its true start and end rather than being clipped.
 * @param {string} rashi - The Rashi to calculate for (e.g., 'Mesh', 'Vrishab')
 * @param {number} year - The year to calculate for
 * @returns {Array<{start: Date, end: Date, duration: number}>} duration in hours
 */
export const calculateChandrashtamForRashi = (rashi, year) => {
    const afflictingIndex = RASHI_ORDER.indexOf(CHANDRASHTAM_MAP[rashi]);
    if (afflictingIndex === -1) {
        console.error('Invalid rashi:', rashi);
        return [];
    }
    const exitIndex = (afflictingIndex + 1) % 12;

    const rangeStart = new Date(Date.UTC(year, 0, 1) - YEAR_MARGIN_MS);
    const rangeEnd = new Date(Date.UTC(year + 1, 0, 1) + YEAR_MARGIN_MS);

    const periods = [];
    // Start from the last ingress before the range so an in-progress period is included
    let start = previousMoonIngress(afflictingIndex, rangeStart);

    while (start < rangeEnd) {
        const end = nextMoonIngress(exitIndex, start);
        if (end > rangeStart) {
            periods.push({
                start,
                end,
                duration: (end - start) / HOUR_MS
            });
        }
        start = nextMoonIngress(afflictingIndex, end);
    }

    return periods;
};

/**
 * Calculate all Chandrashtam periods for all Rashis in a year
 * @param {number} year - The year to calculate for
 * @returns {Object} Object with Rashi names as keys and arrays of periods as values
 */
export const calculateAllChandrashtamForYear = (year) => {
    const allPeriods = {};

    RASHI_ORDER.forEach(rashi => {
        allPeriods[rashi] = calculateChandrashtamForRashi(rashi, year);
    });

    return allPeriods;
};

/**
 * Build the JSON document stored in src/data/chandrashtam-<year>.json
 */
export const buildYearData = (year) => {
    const allPeriods = calculateAllChandrashtamForYear(year);
    const data = {};
    Object.keys(allPeriods).forEach(rashi => {
        data[rashi] = allPeriods[rashi].map(period => ({
            start: period.start.toISOString(),
            end: period.end.toISOString(),
            duration: Number(period.duration.toFixed(3))
        }));
    });

    return {
        year,
        ayanamsa: 'Lahiri',
        generatedAt: new Date().toISOString(),
        data
    };
};

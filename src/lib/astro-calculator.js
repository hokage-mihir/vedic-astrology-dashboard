import {
    getAyanamsa,
    moonSiderealLongitude,
    sunSiderealLongitude,
    moonSpeed,
    sunSpeed,
    nextMoonIngress,
    normalize360,
    RASHI_SPAN,
} from './astro-core.js';

// Cache for calculation results
const calculationCache = new Map();
const CACHE_DURATION = 60000; // 1 minute in milliseconds

// Helper to get cache key rounded to minute
const getCacheKey = (prefix, date = null) => {
    const timeToUse = date ? date.getTime() : Date.now();
    const roundedTime = Math.floor(timeToUse / CACHE_DURATION);
    return `${prefix}_${roundedTime}`;
};

// Helper to clean old cache entries
const cleanOldCache = () => {
    if (calculationCache.size > 10) {
        const now = Math.floor(Date.now() / CACHE_DURATION);
        for (const [key] of calculationCache) {
            const keyTime = parseInt(key.split('_')[1]);
            if (now - keyTime > 5) { // Keep last 5 minutes
                calculationCache.delete(key);
            }
        }
    }
};

export const calculateMoonPosition = (date = null) => {
    const dateToUse = date || new Date();

    // Check cache first
    const cacheKey = getCacheKey('moon', dateToUse);
    if (calculationCache.has(cacheKey)) {
        return calculationCache.get(cacheKey);
    }

    try {
        const siderealLongitude = moonSiderealLongitude(dateToUse);
        const ayanamsa = getAyanamsa(dateToUse);
        const rashiNumber = Math.floor(siderealLongitude / RASHI_SPAN);

        const result = {
            longitude: siderealLongitude,
            degrees_in_rashi: siderealLongitude % RASHI_SPAN,
            rashi_number: rashiNumber,
            ayanamsa: ayanamsa,
            speed: moonSpeed(dateToUse),
            raw_longitude: normalize360(siderealLongitude + ayanamsa),
            // Exact moment the Moon leaves the current rashi
            rashi_end: nextMoonIngress((rashiNumber + 1) % 12, dateToUse)
        };

        // Cache the result
        calculationCache.set(cacheKey, result);
        cleanOldCache();

        return result;
    } catch (error) {
        console.error('Error calculating moon position:', error);
        return null;
    }
};

export const calculateSunPosition = (date = null) => {
    const dateToUse = date || new Date();

    // Check cache first
    const cacheKey = getCacheKey('sun', dateToUse);
    if (calculationCache.has(cacheKey)) {
        return calculationCache.get(cacheKey);
    }

    try {
        const siderealLongitude = sunSiderealLongitude(dateToUse);

        const result = {
            longitude: siderealLongitude,
            rashi_number: Math.floor(siderealLongitude / RASHI_SPAN),
            degrees_in_rashi: siderealLongitude % RASHI_SPAN,
            speed: sunSpeed(dateToUse)
        };

        // Cache the result
        calculationCache.set(cacheKey, result);
        cleanOldCache();

        return result;
    } catch (error) {
        console.error('Error calculating sun position:', error);
        return null;
    }
};

/**
 * Format a duration in milliseconds as "Xh Ym" or "N days Xh Ym".
 */
export const formatDurationMs = (ms) => {
    const totalMinutes = Math.max(0, Math.floor(ms / 60000));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days === 0) {
        return `${hours}h ${minutes}m`;
    }
    const daysText = days === 1 ? 'day' : 'days';
    return `${days} ${daysText} ${hours}h ${minutes}m`;
};
